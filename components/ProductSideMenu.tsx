"use client";
import { Heart } from "lucide-react";
import React, { useCallback } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";

interface ProductBase {
  _id: string;
  name?: string;
  slug?: { current?: string } | null;
}

const ProductSideMenu = React.memo(
  ({ product, className }: { product: ProductBase; className?: string }) => {
    const { favoriteProduct, addToFavorite, isLoading } = useWishlist();

    const isFavorite = favoriteProduct.some(
      (item) => item?._id === product?._id,
    );

    const handleFavorite = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (product?._id && !isLoading) {
          addToFavorite(product as Product);
        }
      },
      [product, isLoading, addToFavorite],
    );

    return (
      <div className={cn("absolute top-3 right-3", className)}>
        <button
          type="button"
          onClick={handleFavorite}
          disabled={isLoading}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          suppressHydrationWarning
          className={cn(
            "p-2.5 rounded-full transition-all",
            isFavorite
              ? "bg-shop_dark_green text-white"
              : "bg-background/80 text-muted-foreground hover:bg-shop_dark_green hover:text-white border border-border",
          )}
        >
          <Heart
            size={16}
            fill={isFavorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  },
);

ProductSideMenu.displayName = "ProductSideMenu";

export default ProductSideMenu;
