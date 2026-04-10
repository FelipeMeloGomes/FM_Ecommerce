import type { MetadataRoute } from "next";
import { getSitemapCategories } from "@/sanity/queries";
import type { SitemapCategory } from "@/types/sitemap";

const BASE_URL = "https://fm-ecommerce-jade.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getSitemapCategories();

  return categories.map((category: SitemapCategory) => ({
    url: `${BASE_URL}/category/${category.slug}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
