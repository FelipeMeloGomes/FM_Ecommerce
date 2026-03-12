import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ brand?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-white">
      <Shop
        categories={categories}
        brands={brands}
        initialBrand={params.brand}
        initialCategory={params.category}
      />
    </div>
  );
}
