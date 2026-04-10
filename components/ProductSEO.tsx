"use client";

import { BreadcrumbJsonLd, ProductJsonLd } from "next-seo";

interface Image {
  asset?: {
    _ref: string;
  };
}

interface Product {
  _id: string;
  name?: string;
  slug?: { current?: string };
  description?: string;
  price?: number;
  discount?: number;
  images?: Image[];
  stock?: number;
  sku?: string;
  brand?: { title?: string } | { _ref?: string } | null;
}

interface ProductSEOProps {
  product: Product;
  breadcrumbs: Array<{ name: string; url: string }>;
  ratingData?: { average: number; count: number };
}

function getImageUrl(ref: string): string {
  const cleanRef = ref.replace("image-", "").replace(/-(\w+)$/, ".$1");
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${cleanRef}`;
}

function calculateDiscountedPrice(price: number, discount: number): number {
  return Number((price * (1 - discount / 100)).toFixed(2));
}

export function ProductSEO({
  product,
  breadcrumbs,
  ratingData,
}: ProductSEOProps) {
  const {
    name,
    slug,
    description,
    price,
    discount = 0,
    images,
    stock = 0,
    sku,
  } = product;

  const productUrl = slug?.current
    ? `https://fm-ecommerce-jade.vercel.app/product/${slug.current}`
    : "https://fm-ecommerce-jade.vercel.app";

  const firstImage = images?.[0];
  const imageUrl = firstImage?.asset?._ref
    ? getImageUrl(firstImage.asset._ref)
    : undefined;

  const finalPrice = price
    ? calculateDiscountedPrice(price, discount)
    : undefined;

  return (
    <>
      <ProductJsonLd
        name={name || "Produto"}
        description={
          description || `Compre ${name || "este produto"} na FMShop`
        }
        image={imageUrl}
        offers={{
          price: finalPrice?.toString() || "0",
          priceCurrency: "BRL",
          availability:
            stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        }}
        url={productUrl}
        sku={sku}
        brand={
          product.brand && "title" in product.brand
            ? product.brand.title
            : undefined
        }
        aggregateRating={
          ratingData && ratingData.count > 0
            ? {
                ratingValue: ratingData.average,
                reviewCount: ratingData.count,
              }
            : undefined
        }
      />
      <BreadcrumbJsonLd
        items={breadcrumbs.map((item) => ({
          name: item.name,
          item: item.url,
        }))}
      />
    </>
  );
}
