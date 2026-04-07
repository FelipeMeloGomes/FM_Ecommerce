"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const questionRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = questionRateLimit.get(userId);

  if (!limit || now > limit.resetAt) {
    questionRateLimit.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  limit.count++;
  return true;
}

export async function sendProductQuestion(
  productId: string,
  productName: string,
  question: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!checkRateLimit(userId)) {
    throw new Error(
      "Muitas tentativas. Aguarde um momento antes de enviar outra pergunta.",
    );
  }

  const user = await currentUser();

  const questionData = {
    _type: "productQuestion",
    product: {
      _type: "reference",
      _ref: productId,
    },
    userId,
    customerName: user?.fullName || user?.username || "Cliente",
    customerImage: user?.imageUrl || null,
    productName,
    question,
    createdAt: new Date().toISOString(),
    answered: false,
  };

  try {
    const result = await writeClient.create(questionData);
    return { success: true, id: result._id };
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

export async function updateQuestion(questionId: string, question: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!question.trim() || question.trim().length < 10) {
    throw new Error("Pergunta deve ter no mínimo 10 caracteres");
  }

  const existingQuestion = await client.fetch(
    `*[_type == "productQuestion" && _id == $questionId && userId == $userId][0]`,
    { questionId, userId },
  );

  if (!existingQuestion) {
    throw new Error("Pergunta não encontrada ou você não tem permissão");
  }

  const createdAt = new Date(existingQuestion.createdAt);
  const daysSinceCreation = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceCreation > 7) {
    throw new Error("Não é possível editar perguntas com mais de 7 dias");
  }

  await writeClient
    .patch(questionId)
    .set({ question: question.trim() })
    .commit();
  return { success: true };
}

export async function deleteQuestion(questionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingQuestion = await client.fetch(
    `*[_type == "productQuestion" && _id == $questionId && userId == $userId][0]`,
    { questionId, userId },
  );

  if (!existingQuestion) {
    throw new Error("Pergunta não encontrada ou você não tem permissão");
  }

  await writeClient.delete(questionId);
  return { success: true };
}

export async function getProductQuestions(productId: string) {
  const query = `*[_type == "productQuestion" && product._ref == $productId] | order(createdAt desc) {
    _id,
    question,
    answer,
    answered,
    createdAt,
    userId,
    customerName,
    customerImage,
    productName
  }`;

  try {
    const questions = await client.fetch(query, { productId });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export async function answerQuestion(questionId: string, answer: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!answer.trim() || answer.trim().length < 10) {
    throw new Error("Resposta deve ter no mínimo 10 caracteres");
  }

  const existingQuestion = await client.fetch(
    `*[_type == "productQuestion" && _id == $questionId][0]`,
    { questionId },
  );

  if (!existingQuestion) {
    throw new Error("Pergunta não encontrada");
  }

  await writeClient
    .patch(questionId)
    .set({ answer: answer.trim(), answered: true })
    .commit();
  return { success: true };
}
