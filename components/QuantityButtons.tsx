import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/sanity.types";
import useStore from "@/store";
import { Button } from "./ui/button";

interface Props {
  product: Product;
  className?: string;
}
const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if (itemCount > 1) {
      toast.success("Quantidade atualizada");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} Produto removido`);
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success("Quantidade atualizada");
    } else {
      toast.error("Estoque insuficiente");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
