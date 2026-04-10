"use client";
import { ShoppingBag } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";
import useStore from "@/store";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { Button } from "./ui/button";

interface Props {
  product: {
    _id: string;
    name?: string;
    price?: number;
    stock?: number;
    images?: Array<{ asset?: { _ref: string } }>;
  };
  className?: string;
}

const AddToCartButton = React.memo(({ product, className }: Props) => {
  const addItem = useStore((state) => state.addItem);
  const items = useStore((state) => state.items);

  const itemCount = useMemo(
    () =>
      items.find((item) => item.product._id === product?._id)?.quantity ?? 0,
    [items, product?._id],
  );

  const [isMounted, setIsMounted] = useState(false);
  const isOutOfStock = product?.stock === 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = useCallback(() => {
    if ((product?.stock as number) > itemCount) {
      addItem(product as Product);
      toast.success(`${product?.name?.substring(0, 20)}... adicionado!`);
    } else {
      toast.error("Estoque insuficiente");
    }
  }, [product, itemCount, addItem]);

  const subtotal = useMemo(
    () => (product?.price ? product?.price * itemCount : 0),
    [product?.price, itemCount],
  );

  if (!isMounted) {
    return (
      <Button
        disabled={isOutOfStock}
        className={cn(
          "w-full bg-shop_dark_green hover:bg-shop_btn_dark_green font-semibold",
          className,
        )}
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        {isOutOfStock ? "Esgotado" : "Comprar"}
      </Button>
    );
  }

  return (
    <div className="w-full">
      {itemCount ? (
        <div className="space-y-2 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quantidade</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-sm font-semibold">Subtotal</span>
            <PriceFormatter
              amount={subtotal}
              className="font-bold text-shop_dark_green"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-shop_dark_green hover:bg-shop_btn_dark_green font-semibold",
            className,
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {isOutOfStock ? "Esgotado" : "Comprar"}
        </Button>
      )}
    </div>
  );
});

AddToCartButton.displayName = "AddToCartButton";

export default AddToCartButton;
