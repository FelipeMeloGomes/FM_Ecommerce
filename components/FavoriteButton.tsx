"use client";
import { Heart } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/sanity.types";

interface FavoriteButtonProps {
  showProduct?: boolean;
  product?: Product | null | undefined;
}

const FavoriteButton = ({
  showProduct = false,
  product,
}: FavoriteButtonProps) => {
  const { favoriteProduct, addToFavorite } = useWishlist();

  const existingProduct = useMemo(
    () => favoriteProduct.find((item) => item?._id === product?._id) || null,
    [favoriteProduct, product?._id],
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (product?._id) {
        addToFavorite(product);
      }
    },
    [product, addToFavorite],
  );

  const favoriteCount = favoriteProduct?.length ?? 0;

  if (!showProduct) {
    return (
      <>
        <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
        <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          {favoriteCount > 0 ? favoriteCount : 0}
        </span>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm"
    >
      {existingProduct ? (
        <Heart
          fill="#3b9c3c"
          className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5"
        />
      ) : (
        <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
      )}
    </button>
  );
};

export default FavoriteButton;
