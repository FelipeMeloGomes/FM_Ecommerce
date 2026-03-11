import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import { ProductGridClient } from "@/components/ProductGridClient";
import ShopByBrands from "@/components/ShopByBrands";
import { client } from "@/sanity/lib/client";
import { getCategories } from "@/sanity/queries";
import { PRODUCTS_BY_VARIANT_QUERY } from "@/sanity/queries/query";

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
    <Container className="bg-shop-light-pink">
      <HomeBanner />
      <ProductGridClient initialProducts={products} />
      <HomeCategories categories={categories} />
      <ShopByBrands />
    </Container>
  );
}
