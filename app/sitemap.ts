import type { MetadataRoute } from "next";
import { getSitemapProducts } from "@/sanity/queries";
import type { SitemapProduct } from "@/types/sitemap";

const BASE_URL = "https://fm-ecommerce-jade.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getSitemapProducts();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const productUrls: MetadataRoute.Sitemap = products.map(
    (product: SitemapProduct) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  return [...staticUrls, ...productUrls];
}
