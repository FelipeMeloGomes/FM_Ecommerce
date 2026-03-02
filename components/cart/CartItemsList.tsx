"use client";

import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import ProductSideMenu from "@/components/ProductSideMenu";
import QuantityButtons from "@/components/QuantityButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { confirmToast } from "@/helpers/confirmToast";
import { urlFor } from "@/sanity/lib/image";
import useStore, { type CartItem } from "@/store";

interface CartItemsListProps {
  items: CartItem[];
}

const CartItemsList = React.memo(({ items }: CartItemsListProps) => {
  const { deleteCartProduct, getItemCount } = useStore();

  return (
    <>
      {items.map(({ product }) => {
        const itemCount = getItemCount(product?._id);

        return (
          <div
            key={product?._id}
            className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
          >
            <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
              {product?.images && (
                <Link
                  href={`/product/${product?.slug?.current}`}
                  className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                >
                  <Image
                    src={urlFor(product?.images[0]).url()}
                    alt="productImage"
                    width={500}
                    height={500}
                    loading="lazy"
                    className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                  />
                </Link>
              )}

              <div className="h-full flex flex-1 flex-col justify-between py-1">
                <div className="flex flex-col gap-0.5 md:gap-1.5">
                  <h2 className="text-base font-semibold line-clamp-1">
                    {product?.name}
                  </h2>

                  <p className="text-sm capitalize">
                    Variante:{" "}
                    <span className="font-semibold">{product?.variant}</span>
                  </p>

                  <p className="text-sm capitalize">
                    Status:{" "}
                    <span className="font-semibold">{product?.status}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ProductSideMenu
                          product={product}
                          className="relative top-0 right-0"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="font-bold">
                        Adicionar aos favoritos
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Trash
                          onClick={() => {
                            confirmToast({
                              message: "Deseja remover este produto?",
                              onConfirm: () => {
                                deleteCartProduct(product?._id);
                                toast.success("Produto deletado com sucesso!");
                              },
                            });
                          }}
                          className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                        />
                      </TooltipTrigger>
                      <TooltipContent className="font-bold bg-red-600">
                        Apagar Produto
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
              <PriceFormatter
                amount={(product?.price as number) * itemCount}
                className="font-bold text-lg"
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
