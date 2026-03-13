import { SanityBrandRepository } from "@/services/brands/SanityBrandRepository";
import AdminBrandsList from "./AdminBrandsList";

export default async function AdminBrandsPage() {
  const repository = new SanityBrandRepository();
  const brands = await repository.findAll();
  return <AdminBrandsList initialBrands={brands} />;
}
