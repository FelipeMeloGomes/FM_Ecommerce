import { SanityCategoryRepository } from "@/services/categories/SanityCategoryRepository";
import AdminCategoriesList from "./AdminCategoriesList";

export default async function AdminCategoriesPage() {
  const repository = new SanityCategoryRepository();
  const categories = await repository.findAll();

  return <AdminCategoriesList initialCategories={categories} />;
}
