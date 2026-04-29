"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { err, ok, type ServerResult } from "@/lib/server-result";
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

export async function addToWishlist(productId: string): Promise<ServerResult> {
  const user = await currentUser();

  if (!user) {
    return err("Unauthorized");
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
        const newItem = {
          _type: "reference" as const,
          _ref: productId,
          _key: crypto.randomUUID(),
        };
        await writeClient
          .patch(existingWishlist._id)
          .setIfMissing({ items: [] })
          .append("items", [newItem])
          .set({ updatedAt: new Date().toISOString() })
          .commit();
      }
    } else {
      const newItem = {
        _type: "reference" as const,
        _ref: productId,
        _key: crypto.randomUUID(),
      };
      await writeClient.create({
        _type: "wishlist",
        clerkUserId,
        items: [newItem],
      });
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return ok();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return err("Failed to add to wishlist");
  }
}

export async function removeFromWishlist(
  productId: string,
): Promise<ServerResult> {
  const user = await currentUser();

  if (!user) {
    return err("Unauthorized");
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
      const items = (existingWishlist.items || [])
        .filter((item: { _ref: string }) => item._ref !== productId)
        .map((item: { _ref: string; _key?: string }) => ({
          _type: "reference" as const,
          _ref: item._ref,
          _key: item._key || crypto.randomUUID(),
        }));

      await writeClient
        .patch(existingWishlist._id)
        .set({ items, updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return ok();
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return err("Failed to remove from wishlist");
  }
}

export async function resetWishlist(): Promise<ServerResult> {
  const user = await currentUser();

  if (!user) {
    return err("Unauthorized");
  }

  const clerkUserId = user.id;

  try {
    const wishlistQuery = `*[_type == "wishlist" && clerkUserId == $clerkUserId][0]`;
    const existingWishlist = await writeClient.fetch(wishlistQuery, {
      clerkUserId,
    });

    if (existingWishlist) {
      const emptyItems: Array<{
        _type: "reference";
        _ref: string;
        _key: string;
      }> = [];
      await writeClient
        .patch(existingWishlist._id)
        .set({ items: emptyItems, updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/wishlist");
    revalidatePath("/product");
    return ok();
  } catch (error) {
    console.error("Error resetting wishlist:", error);
    return err("Failed to reset wishlist");
  }
}
