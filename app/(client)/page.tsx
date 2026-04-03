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

async function getProducts(variant: string) {
  return client.fetch(PRODUCTS_BY_VARIANT_QUERY, { variant });
}

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(6),
    getProducts(DEFAULT_VARIANT),
  ]);

  return (
    <Container className="bg-shop-light-pink dark:bg-zinc-900">
      <section className="pb-8 lg:pb-12">
        <HomeBanner />
      </section>
      <section className="pb-8 lg:pb-12">
        <ProductGrid initialProducts={products} />
      </section>
      <section className="pb-8 lg:pb-12">
        <HomeCategories categories={categories} />
      </section>
      <section className="pb-12 lg:pb-16">
        <ShopByBrands />
      </section>
    </Container>
  );
}
