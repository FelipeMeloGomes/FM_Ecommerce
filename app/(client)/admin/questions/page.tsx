import { client } from "@/sanity/lib/client";
import AdminQuestionsList from "./AdminQuestionsList";

export const dynamic = "force-dynamic";

async function getAllQuestions() {
  const query = `*[_type == "productQuestion"] | order(createdAt desc) {
    _id,
    question,
    answer,
    answered,
    createdAt,
    userId,
    customerName,
    customerImage,
    productName,
    "product": product->{
      _id,
      name,
      "slug": slug.current
    }
  }`;

  try {
    const questions = await client.fetch(query);
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function AdminQuestionsPage() {
  const questions = await getAllQuestions();
  return <AdminQuestionsList initialQuestions={questions} />;
}
