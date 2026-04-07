"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/writeClient";

export async function getWishlist() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const clerkUserId = user.id;

  try {
    const wishlistQuery = `*[_type == "wishlist" && clerkUserId == $clerkUserId][0]{
      items[]->{
        _id,
        name,
        slug,
        price,
        discount,
        images,
        variants,
        stock,
        variant,
        categories[]->{
          _id,
          title,
          slug
        }
      }
    }`;

    const wishlist = await writeClient.fetch(wishlistQuery, { clerkUserId });

    return wishlist?.items || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
}

export async function addToWishlist(productId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const clerkUserId = user.id;

  try {
    const wishlistQuery = `*[_type == "wishlist" && clerkUserId == $clerkUserId][0]{
      _id,
      items[]{
        _ref
      }
    }`;
    const existingWishlist = await writeClient.fetch(wishlistQuery, {
      clerkUserId,
    });

    if (existingWishlist) {
      const items = existingWishlist.items || [];
      const hasProduct = items.some(
        (item: { _ref: string }) => item._ref === productId,
      );

      if (!hasProduct) {
        await writeClient
          .patch(existingWishlist._id)
          .setIfMissing({ items: [] })
          .append("items", [
            { _type: "reference", _ref: productId, _weak: true },
          ])
          .set({ updatedAt: new Date().toISOString() })
          .commit();
      }
    } else {
      await writeClient.create({
        _type: "wishlist",
        clerkUserId,
        items: [{ _type: "reference", _ref: productId, _weak: true }],
      });
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
}

export async function removeFromWishlist(productId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const clerkUserId = user.id;

  try {
    const wishlistQuery = `*[_type == "wishlist" && clerkUserId == $clerkUserId][0]`;
    const existingWishlist = await writeClient.fetch(wishlistQuery, {
      clerkUserId,
    });

    if (existingWishlist) {
      const items = (existingWishlist.items || [])
        .filter((item: { _ref: string }) => item._ref !== productId)
        .map((item: { _ref: string }) => ({
          _type: "reference",
          _ref: item._ref,
        }));

      await writeClient
        .patch(existingWishlist._id)
        .set({ items, updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
}

export async function resetWishlist() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const clerkUserId = user.id;

  try {
    const wishlistQuery = `*[_type == "wishlist" && clerkUserId == $clerkUserId][0]`;
    const existingWishlist = await writeClient.fetch(wishlistQuery, {
      clerkUserId,
    });

    if (existingWishlist) {
      await writeClient
        .patch(existingWishlist._id)
        .set({ items: [], updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return { success: true };
  } catch (error) {
    console.error("Error resetting wishlist:", error);
    throw new Error("Failed to reset wishlist");
  }
}
