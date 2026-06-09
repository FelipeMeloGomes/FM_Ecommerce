"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type ReviewInput, reviewSchema } from "@/lib/schemas/reviewSchema";
import { err, ok, type ServerResult } from "@/lib/server-result";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { uploadReviewImages } from "./uploadReviewImages";

const CONFIG = {
  MIN_DAYS_AFTER_PURCHASE: 0,
  EDIT_DAYS_LIMIT: 7,
  FORBIDDEN_WORDS: ["palavrao1", "palavrao2", "spam"],
};

export async function verifyPurchase(
  userId: string,
  productId: string,
): Promise<{ hasPurchased: boolean; purchaseDate?: string }> {
  const order = await client.fetch(
    `*[_type == "order" && clerkUserId == $userId && status in ["paid", "shipped", "delivered"] && $productId in products[].product._ref][0]{
      _id,
      orderDate
    }`,
    { userId, productId },
  );

  if (!order) return { hasPurchased: false };

  const purchaseDate = order.orderDate || order._createdAt;
  return { hasPurchased: true, purchaseDate };
}

export async function checkCanReview(userId: string, productId: string) {
  const { hasPurchased, purchaseDate } = await verifyPurchase(
    userId,
    productId,
  );

  if (!hasPurchased) {
    return {
      canReview: false,
      reason: "Você precisa comprar este produto para avaliá-lo",
    };
  }

  const existingReview = await getUserReviewForProduct(userId, productId);
  if (existingReview) {
    return { canReview: false, reason: "Você já avaliou este produto" };
  }

  if (CONFIG.MIN_DAYS_AFTER_PURCHASE > 0 && purchaseDate) {
    const daysSincePurchase = Math.floor(
      (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePurchase < CONFIG.MIN_DAYS_AFTER_PURCHASE) {
      return {
        canReview: false,
        reason: `Aguarde ${CONFIG.MIN_DAYS_AFTER_PURCHASE - daysSincePurchase} dias após a compra para avaliar`,
      };
    }
  }

  return { canReview: true, reason: undefined };
}

function containsForbiddenWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CONFIG.FORBIDDEN_WORDS.some((word) =>
    lowerText.includes(word.toLowerCase()),
  );
}

export async function createReview(input: ReviewInput): Promise<ServerResult> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return err("Unauthorized");
  }

  const validated = reviewSchema.safeParse(input);
  if (!validated.success) {
    return err(validated.error.issues[0].message);
  }

  const { canReview, reason } = await checkCanReview(
    userId,
    validated.data.productId,
  );
  if (!canReview) {
    return err(reason ?? "Você não pode avaliar este produto");
  }

  if (
    containsForbiddenWords(validated.data.title) ||
    containsForbiddenWords(validated.data.comment)
  ) {
    return err("Conteúdo impróprio detectado");
  }

  let images: Array<{
    _key: string;
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  }> = [];

  const v = validated.data;

  if (v.images && v.images.length > 0) {
    const imagesResult = await uploadReviewImages(Array.from(v.images));
    if (!imagesResult.success) {
      return err(imagesResult.error);
    }
    images = imagesResult.data;
  }

  await writeClient.create({
    _type: "review",
    product: {
      _type: "reference",
      _ref: v.productId,
    },
    clerkUserId: userId,
    customerName: user.fullName || user.username || "Cliente",
    customerImage: user.imageUrl || null,
    rating: v.rating,
    title: v.title,
    comment: v.comment,
    verifiedPurchase: true,
    status: "approved",
    ...(images.length > 0 && { images }),
  });

  revalidatePath(`/product`);
  return ok();
}

export async function updateReview(
  reviewId: string,
  input: Partial<ReviewInput>,
): Promise<ServerResult> {
  const { userId } = await auth();

  if (!userId) {
    return err("Unauthorized");
  }

  const review = await client.fetch(
    `*[_type == "review" && _id == $reviewId && clerkUserId == $userId][0]`,
    { reviewId, userId },
  );

  if (!review) {
    return err("Avaliação não encontrada");
  }

  const createdAt = new Date(review._createdAt);
  const daysSinceCreation = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceCreation > CONFIG.EDIT_DAYS_LIMIT) {
    return err(
      `Você pode editar até ${CONFIG.EDIT_DAYS_LIMIT} dias após a avaliação`,
    );
  }

  const partialSchema = reviewSchema.partial();
  const validated = partialSchema.safeParse(input);
  if (!validated.success) {
    return err(validated.error.issues[0].message);
  }

  const updateData: Record<string, unknown> = {};

  if (validated.data.title !== undefined) {
    if (containsForbiddenWords(validated.data.title)) {
      return err("Conteúdo impróprio detectado");
    }
    updateData.title = validated.data.title;
  }

  if (validated.data.comment !== undefined) {
    if (containsForbiddenWords(validated.data.comment)) {
      return err("Conteúdo impróprio detectado");
    }
    updateData.comment = validated.data.comment;
  }

  if (validated.data.rating !== undefined) {
    updateData.rating = validated.data.rating;
  }

  if (
    validated.data.images !== undefined ||
    validated.data.keepImageIds !== undefined
  ) {
    const existingReview = await client.fetch(
      `*[_type == "review" && _id == $reviewId][0]{ images }`,
      { reviewId },
    );

    const keepImageIds = validated.data.keepImageIds || [];
    const hasNewImages =
      validated.data.images && validated.data.images.length > 0;

    const imagesToKeep = (existingReview?.images || []).filter(
      (img: { asset?: { _ref: string } }) =>
        keepImageIds.includes(img.asset?._ref || ""),
    );

    let newImages: Array<{
      _key: string;
      _type: "image";
      asset: { _type: "reference"; _ref: string };
    }> = [];

    if (hasNewImages && validated.data.images) {
      const newImagesResult = await uploadReviewImages(
        Array.from(validated.data.images),
      );
      if (!newImagesResult.success) {
        return err(newImagesResult.error);
      }
      newImages = newImagesResult.data;
    }

    updateData.images = [...imagesToKeep, ...newImages];
  }

  await writeClient.patch(reviewId).set(updateData).commit();

  revalidatePath(`/product`);
  return ok();
}

export async function deleteReview(reviewId: string): Promise<ServerResult> {
  const { userId } = await auth();

  if (!userId) {
    return err("Unauthorized");
  }

  const review = await client.fetch(
    `*[_type == "review" && _id == $reviewId && clerkUserId == $userId][0]`,
    { reviewId, userId },
  );

  if (!review) {
    return err("Avaliação não encontrada ou você não tem permissão");
  }

  await writeClient.delete(reviewId);

  revalidatePath(`/product`);
  return ok();
}

export async function getUserReviewForProduct(
  userId: string,
  productId: string,
) {
  const review = await client.fetch(
    `*[_type == "review" && clerkUserId == $userId && product._ref == $productId][0]`,
    { userId, productId },
  );
  return review;
}

export async function getProductReviews(productId: string) {
  const reviews = await client.fetch(
    `*[_type == "review" && product._ref == $productId] | order(_createdAt desc) {
      _id,
      clerkUserId,
      customerName,
      customerImage,
      rating,
      title,
      comment,
      verifiedPurchase,
      images,
      _createdAt
    }`,
    { productId },
  );
  return reviews;
}

export async function getProductRating(productId: string) {
  const result = await client.fetch(
    `{
      "avg": math::avg(*[_type == "review" && product._ref == $productId].rating),
      "count": count(*[_type == "review" && product._ref == $productId])
    }`,
    { productId },
  );
  return {
    average: result.avg || 0,
    count: result.count || 0,
  };
}
