import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBrands, getCategories } from "@/sanity/queries";

const AdminAddProducts = dynamic(() => import("./AdminAddProducts"), {
  loading: () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  ),
});

export default async function AddProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getAllBrands(),
  ]);

  return <AdminAddProducts categories={categories} brands={brands} />;
}
