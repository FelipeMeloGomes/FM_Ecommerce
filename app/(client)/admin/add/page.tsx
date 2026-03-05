import { getAllBrands, getCategories } from "@/sanity/queries";
import AdminAddProducts from "./AdminAddProducts";

export default async function AddProductPage() {
  const categories = await getCategories();
  const brands = await getAllBrands();

  return <AdminAddProducts categories={categories} brands={brands} />;
}
