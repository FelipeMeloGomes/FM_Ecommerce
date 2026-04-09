import { getAllBrands, getCategories } from "@/sanity/queries";
import AdminAddProducts from "./AdminAddProducts";

export default async function AddProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getAllBrands(),
  ]);

  return <AdminAddProducts categories={categories} brands={brands} />;
}
