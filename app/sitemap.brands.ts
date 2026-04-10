import type { MetadataRoute } from "next";
import { getSitemapBrands } from "@/sanity/queries";
import type { SitemapBrand } from "@/types/sitemap";

const BASE_URL = "https://fm-ecommerce-jade.vercel.app/";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brands = await getSitemapBrands();

  return brands.map((brand: SitemapBrand) => ({
    url: `${BASE_URL}/brand/${brand.slug}`,
    lastModified: new Date(brand._updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
