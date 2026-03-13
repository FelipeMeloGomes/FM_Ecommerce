export const dynamic = "force-dynamic";

import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import { AdminProductsList } from "./AdminProductsList";

export default async function AdminProductsPage() {
  const repository = new SanityProductRepository();
  const products = await repository.findAll();
  return <AdminProductsList initialProducts={products} />;
}
