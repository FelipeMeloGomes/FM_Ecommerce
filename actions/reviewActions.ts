"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { uploadReviewImages } from "./uploadReviewImages";

const CONFIG = {
  MIN_COMMENT_LENGTH: 20,
  MAX_TITLE_LENGTH: 100,
  MAX_COMMENT_LENGTH: 1000,
  MIN_DAYS_AFTER_PURCHASE: 0,
  EDIT_DAYS_LIMIT: 7,
  FORBIDDEN_WORDS: ["palavrao1", "palavrao2", "spam"],
};

export interface ReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: File[];
  keepImageIds?: string[];
}

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

export async function createReview(input: ReviewInput) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const { canReview, reason } = await checkCanReview(userId, input.productId);
  if (!canReview) {
    throw new Error(reason);
  }

  if (input.title.length < 3 || input.title.length > CONFIG.MAX_TITLE_LENGTH) {
    throw new Error(
      `Título deve ter entre 3 e ${CONFIG.MAX_TITLE_LENGTH} caracteres`,
    );
  }

  if (
    input.comment.length < CONFIG.MIN_COMMENT_LENGTH ||
    input.comment.length > CONFIG.MAX_COMMENT_LENGTH
  ) {
    throw new Error(
      `Comentário deve ter entre ${CONFIG.MIN_COMMENT_LENGTH} e ${CONFIG.MAX_COMMENT_LENGTH} caracteres`,
    );
  }

  if (
    containsForbiddenWords(input.title) ||
    containsForbiddenWords(input.comment)
  ) {
    throw new Error("Conteúdo impróprio detectado");
  }

  const images = input.images
    ? await uploadReviewImages(Array.from(input.images))
    : [];

  await writeClient.create({
    _type: "review",
    product: {
      _type: "reference",
      _ref: input.productId,
    },
    clerkUserId: userId,
    customerName: user.fullName || user.username || "Cliente",
    customerImage: user.imageUrl || null,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
    verifiedPurchase: true,
    status: "approved",
    ...(images.length > 0 && { images }),
  });

  revalidatePath(`/product`);
  return { success: true };
}

export async function updateReview(
  reviewId: string,
  input: Partial<ReviewInput>,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const review = await client.fetch(
    `*[_type == "review" && _id == $reviewId && clerkUserId == $userId][0]`,
    { reviewId, userId },
  );

  if (!review) {
    throw new Error("Avaliação não encontrada");
  }

  const createdAt = new Date(review._createdAt);
  const daysSinceCreation = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceCreation > CONFIG.EDIT_DAYS_LIMIT) {
    throw new Error(
      `Você pode editar até ${CONFIG.EDIT_DAYS_LIMIT} dias após a avaliação`,
    );
  }

  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) {
    if (
      input.title.length < 3 ||
      input.title.length > CONFIG.MAX_TITLE_LENGTH
    ) {
      throw new Error(
        `Título deve ter entre 3 e ${CONFIG.MAX_TITLE_LENGTH} caracteres`,
      );
    }
    if (containsForbiddenWords(input.title)) {
      throw new Error("Conteúdo impróprio detectado");
    }
    updateData.title = input.title;
  }

  if (input.comment !== undefined) {
    if (
      input.comment.length < CONFIG.MIN_COMMENT_LENGTH ||
      input.comment.length > CONFIG.MAX_COMMENT_LENGTH
    ) {
      throw new Error(
        `Comentário deve ter entre ${CONFIG.MIN_COMMENT_LENGTH} e ${CONFIG.MAX_COMMENT_LENGTH} caracteres`,
      );
    }
    if (containsForbiddenWords(input.comment)) {
      throw new Error("Conteúdo impróprio detectado");
    }
    updateData.comment = input.comment;
  }

  if (input.rating !== undefined) {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error("Rating deve ser entre 1 e 5");
    }
    updateData.rating = input.rating;
  }

  if (input.images !== undefined || input.keepImageIds !== undefined) {
    const existingReview = await client.fetch(
      `*[_type == "review" && _id == $reviewId][0]{ images }`,
      { reviewId },
    );

    const keepImageIds = input.keepImageIds || [];
    const hasNewImages = input.images && input.images.length > 0;

    const imagesToKeep = (existingReview?.images || []).filter(
      (img: { asset?: { _ref: string } }) =>
        keepImageIds.includes(img.asset?._ref || ""),
    );

    const newImages = hasNewImages
      ? await uploadReviewImages(Array.from(input.images!))
      : [];

    updateData.images = [...imagesToKeep, ...newImages];
  }

  await writeClient.patch(reviewId).set(updateData).commit();

  revalidatePath(`/product`);
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const review = await client.fetch(
    `*[_type == "review" && _id == $reviewId && clerkUserId == $userId][0]`,
    { reviewId, userId },
  );

  if (!review) {
    throw new Error("Avaliação não encontrada ou você não tem permissão");
  }

  await writeClient.delete(reviewId);

  revalidatePath(`/product`);
  return { success: true };
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
