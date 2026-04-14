import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import { ProductGrid } from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { client } from "@/sanity/lib/client";
import { getCategories } from "@/sanity/queries";
import { PRODUCTS_BY_VARIANT_QUERY } from "@/sanity/queries/query";

export const revalidate = 60;

const DEFAULT_VARIANT = "gadget";
const HOME_PRODUCTS_LIMIT = 20;

async function getProducts(variant: string) {
  return client.fetch(PRODUCTS_BY_VARIANT_QUERY, {
    variant,
    limit: HOME_PRODUCTS_LIMIT,
  });
}

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(6),
    getProducts(DEFAULT_VARIANT),
  ]);

  return (
    <Container className="bg-shop-light-pink dark:bg-neutral-950">
      <div className="space-y-0 lg:space-y-0">
        <section className="pb-0 lg:pb-0">
          <HomeBanner />
        </section>

        <section className="px-4 lg:px-0 py-8 lg:py-12">
          <ProductGrid initialProducts={products} />
        </section>

        <section className="px-4 lg:px-0 pb-8 lg:pb-12">
          <HomeCategories categories={categories} />
        </section>

        <section className="px-4 lg:px-0 pb-12 lg:pb-16">
          <ShopByBrands />
        </section>
      </div>
    </Container>
  );
}
