import type {
  SitemapBrand,
  SitemapCategory,
  SitemapProduct,
} from "@/types/sitemap";
import { sanityFetch, sanityFetchStatic } from "../lib/live";
import {
  BRAND_QUERY,
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  DEAL_PRODUCTS,
  LIMITED_CATEGORIES_QUERY,
  MY_ORDERS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_BY_BRAND_QUERY,
  SITEMAP_BRANDS_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_PRODUCTS_QUERY,
} from "./query";

const getCategories = async (quantity?: number) => {
  try {
    if (quantity !== undefined) {
      const { data } = await sanityFetch({
        query: LIMITED_CATEGORIES_QUERY,
        params: { quantity },
      });
      return data ?? [];
    }

    const { data } = await sanityFetch({
      query: CATEGORIES_QUERY,
    });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ query: BRANDS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all brands:", error);
    return [];
  }
};

const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS, stega: false });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products:", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
      stega: false,
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getBrand = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: BRAND_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

const getProductsByBrand = async (brandSlug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_BRAND_QUERY,
      params: { brandSlug },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    return [];
  }
};

const getMyOrders = async (userId: string, start = 0, end = 10) => {
  try {
    const result = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId, start, end },
      stega: false,
    });

    return {
      orders: result?.data?.orders ?? [],
      total: result?.data?.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0 };
  }
};

export {
  getCategories,
  getAllBrands,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getProductsByBrand,
  getMyOrders,
};

export const getCategoriesStatic = async () => {
  const query = `*[_type == 'category'] | order(name asc) {
    "slug": slug.current
  }`;
  const data = await sanityFetchStatic<{ slug: string }[]>(query);
  return data ?? [];
};

export const getSitemapProducts = async (): Promise<SitemapProduct[]> => {
  try {
    const data = await sanityFetchStatic<SitemapProduct[]>(
      SITEMAP_PRODUCTS_QUERY,
    );
    return data ?? [];
  } catch (error) {
    console.error("Error fetching sitemap products:", error);
    return [];
  }
};

export const getSitemapCategories = async (): Promise<SitemapCategory[]> => {
  try {
    const data = await sanityFetchStatic<SitemapCategory[]>(
      SITEMAP_CATEGORIES_QUERY,
    );
    return data ?? [];
  } catch (error) {
    console.error("Error fetching sitemap categories:", error);
    return [];
  }
};

export const getSitemapBrands = async (): Promise<SitemapBrand[]> => {
  try {
    const data = await sanityFetchStatic<SitemapBrand[]>(SITEMAP_BRANDS_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Error fetching sitemap brands:", error);
    return [];
  }
};
