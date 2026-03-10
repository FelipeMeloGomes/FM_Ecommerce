import { redirect } from "next/navigation";
import { SanityCategoryRepository } from "@/services/categories/SanityCategoryRepository";
import EditCategoryForm from "./EditCategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const repository = new SanityCategoryRepository();
  const category = await repository.findById(id);

  if (!category) {
    redirect("/admin/categories");
  }

  return <EditCategoryForm category={category} />;
}
