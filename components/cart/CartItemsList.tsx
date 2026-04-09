"use client";

import { Heart, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback } from "react";
import { toast } from "sonner";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { confirmToast } from "@/helpers/confirmToast";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import useStore, { type CartItem } from "@/store";

interface CartItemsListProps {
  items: CartItem[];
}

const CartItemsList = React.memo(({ items }: CartItemsListProps) => {
  const deleteCartProduct = useStore((state) => state.deleteCartProduct);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const getItemCount = useStore((state) => state.getItemCount);

  const handleAddToFavorite = useCallback(
    (product: CartItem["product"]) => {
      if (product?._id) {
        addToFavorite(product);
        toast.success("Produto adicionado aos favoritos!");
      }
    },
    [addToFavorite],
  );

  const handleRemoveProduct = useCallback(
    (productId?: string) => {
      confirmToast({
        message: "Deseja remover este produto?",
        onConfirm: () => {
          deleteCartProduct(productId);
          toast.success("Produto removido!");
        },
      });
    },
    [deleteCartProduct],
  );

  return (
    <>
      {items.map(({ product }) => {
        const itemCount = product?._id ? getItemCount(product._id) : 0;
        const isFavorite = product
          ? favoriteProduct?.some((item) => item?._id === product._id)
          : false;

        return (
          <div
            key={product?._id}
            className="border-b border-border/40 last:border-b-0 p-4 flex items-center justify-between gap-4"
          >
            <div className="flex flex-1 items-start gap-4">
              {product?.images && (
                <Link
                  href={`/product/${product?.slug?.current}`}
                  className="shrink-0 rounded-lg overflow-hidden border"
                >
                  <Image
                    src={urlFor(product?.images[0]).url()}
                    alt="productImage"
                    width={120}
                    height={120}
                    loading="lazy"
                    className="w-24 h-24 md:w-32 md:h-32 object-cover"
                  />
                </Link>
              )}

              <div className="flex flex-1 flex-col justify-between min-h-[100px]">
                <div className="space-y-1">
                  <h2 className="font-semibold line-clamp-2">
                    {product?.name}
                  </h2>

                  <p className="text-sm text-muted-foreground capitalize">
                    Variante:{" "}
                    <span className="font-medium">{product?.variant}</span>
                  </p>

                  <p className="text-sm text-muted-foreground capitalize">
                    Status:{" "}
                    <span className="font-medium">{product?.status}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="mt-1"
                          onClick={() => handleAddToFavorite(product)}
                        >
                          <Heart
                            className={cn(
                              "w-5 h-5 transition-colors",
                              isFavorite
                                ? "fill-shop_dark_green text-shop_dark_green"
                                : "text-muted-foreground hover:text-shop_dark_green",
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Adicionar aos favoritos</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="mt-1"
                          onClick={() => handleRemoveProduct(product?._id)}
                        >
                          <Trash className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">Remover produto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between gap-3">
              <PriceFormatter
                amount={(product?.price as number) * itemCount}
                className="font-bold text-lg text-shop_dark_green"
              />
              <QuantityButtons product={product} />
            </div>
          </div>
        );
      })}
    </>
  );
});

CartItemsList.displayName = "CartItemsList";

export default CartItemsList;
