import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/sanity.types";

type CompatibleProduct = Product & ProductWithRating;

import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";
import ProductSideMenu from "./ProductSideMenu";
import StarRating from "./StarRating";
import Title from "./Title";
import { Badge } from "./ui/badge";
import { StockBadge } from "./ui/stock-badge";

export type ProductWithRating = Omit<Product, "categories"> & {
  categories?:
    | (
        | string
        | null
        | { _ref: string; _type: "reference"; _key: string }
        | {
            _id?: string;
            title?: string | null;
            slug?: { current?: string } | null;
          }
      )[]
    | null;
  rating?: number;
  reviewCount?: number;
};

const ProductCard = React.memo(
  ({
    product,
    rating: propRating,
    reviewCount: propReviewCount,
  }: {
    product: ProductWithRating;
    rating?: number;
    reviewCount?: number;
  }) => {
    const reviewCountValue = propReviewCount ?? product?.reviewCount ?? 0;
    const averageRating =
      propRating ??
      (Array.isArray(product?.rating)
        ? product.rating.reduce((a: number, b: number) => a + b, 0) /
          product.rating.length
        : (product?.rating ?? 0));

    return (
      <div className="group relative bg-card border border-border/60 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-shop_orange/10 transition-all duration-300">
        <div className="relative aspect-square bg-muted/20 overflow-hidden">
          {product?.images && (
            <Link href={`/product/${product?.slug?.current}`}>
              <Image
                src={urlFor(product.images[0]).url()}
                alt={product?.name || "Imagem do produto"}
                width={500}
                height={500}
                priority
                className={`w-full h-full object-contain transition-transform duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50 grayscale"}`}
              />
            </Link>
          )}
          <ProductSideMenu product={product as CompatibleProduct} />
          {product?.status === "sale" ? (
            <Badge className="absolute top-3 left-3 bg-destructive/90 text-white text-xs font-medium">
              Promoção!
            </Badge>
          ) : (
            <Link
              href={"/deal"}
              className="absolute top-3 left-3 p-1.5 rounded-full bg-shop_orange/90 hover:bg-shop_orange transition-colors"
            >
              <Flame size={16} className="text-white" />
            </Link>
          )}
        </div>
        <div className="p-4 flex flex-col gap-3">
          {product?.categories && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider line-clamp-1">
              {product.categories.map((cat) => cat).join(", ")}
            </p>
          )}
          <Title className="text-base line-clamp-2 leading-tight">
            {product?.name}
          </Title>
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} />
            {reviewCountValue > 0 ? (
              <p className="text-xs text-muted-foreground">
                ({reviewCountValue})
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">(0)</p>
            )}
          </div>

          <StockBadge stock={product?.stock} className="w-fit" />

          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-base"
          />
          <AddToCartButton
            product={product as CompatibleProduct}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
