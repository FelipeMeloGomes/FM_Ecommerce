"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";
import useStore from "@/store";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id,
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product);
      toast.success(
        existingProduct
          ? "Produto removido dos favoritos!"
          : "Produto adicionado aos favoritos!",
      );
    }
  };
  return (
    <div className={cn("absolute top-3 right-3", className)}>
      <button
        type="button"
        onClick={handleFavorite}
        aria-pressed={!!existingProduct}
        className={cn(
          "p-2.5 rounded-full transition-all",
          existingProduct
            ? "bg-shop_dark_green text-white"
            : "bg-background/80 text-muted-foreground hover:bg-shop_dark_green hover:text-white border border-border",
        )}
      >
        <Heart size={16} fill={existingProduct ? "currentColor" : "none"} />
      </button>
    </div>
  );
};

export default ProductSideMenu;
