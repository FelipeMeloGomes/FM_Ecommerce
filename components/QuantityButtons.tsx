import { Minus, Plus } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";
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
const QuantityButtons = React.memo(({ product, className }: Props) => {
  const { addItem, removeItem, getItemQuantity } = useCart();

  const itemCount = getItemQuantity(product?._id ?? "");

  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = useCallback(() => {
    removeItem(product?._id);
    if (itemCount > 1) {
      toast.success("Quantidade atualizada");
    } else {
      toast.success("Produto removido");
    }
  }, [product?._id, itemCount, removeItem]);

  const handleAddToCart = useCallback(() => {
    if ((product?.stock as number) > itemCount) {
      addItem(product as Product);
      toast.success("Quantidade atualizada");
    } else {
      toast.error("Estoque insuficiente");
    }
  }, [product, itemCount, addItem]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-8 h-8 border-border hover:border-shop_dark_green hover:bg-shop_dark_green/5"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="font-semibold text-sm w-8 text-center text-foreground">
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-8 h-8 border-border hover:border-shop_dark_green hover:bg-shop_dark_green/5"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
});

QuantityButtons.displayName = "QuantityButtons";

export default QuantityButtons;
