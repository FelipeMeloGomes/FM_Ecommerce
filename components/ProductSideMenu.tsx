"use client";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite, isLoading } = useWishlist();

  const isFavorite = favoriteProduct.some((item) => item?._id === product?._id);

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (product?._id && !isLoading) {
      addToFavorite(product);
    }
  };

  return (
    <div className={cn("absolute top-3 right-3", className)}>
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isLoading}
        aria-pressed={isFavorite}
        className={cn(
          "p-2.5 rounded-full transition-all",
          isFavorite
            ? "bg-shop_dark_green text-white"
            : "bg-background/80 text-muted-foreground hover:bg-shop_dark_green hover:text-white border border-border",
        )}
      >
        <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ProductSideMenu;
