import { notFound } from "next/navigation";
import { getAllBrands, getCategories } from "@/sanity/queries";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import { EditProductForm } from "./EditProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const repository = new SanityProductRepository();
  const product = await repository.findById(id);
  const categories = await getCategories();
  const brands = await getAllBrands();

  if (!product) {
    notFound();
  }

  return (
    <EditProductForm
      product={product}
      categories={categories}
      brands={brands}
    />
  );
}
