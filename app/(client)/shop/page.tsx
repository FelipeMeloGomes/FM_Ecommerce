import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ brand?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const [categories, brands] = await Promise.all([
    getCategories(),
    getAllBrands(),
  ]);
  return (
    <div>
      <Shop
        categories={categories}
        brands={brands}
        initialBrand={params.brand}
        initialCategory={params.category}
      />
    </div>
  );
}
