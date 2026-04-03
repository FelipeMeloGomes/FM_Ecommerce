import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <PriceFormatter
        amount={price}
        className={cn("text-xl font-bold text-shop_dark_green", className)}
      />
      {price && discount && (
        <PriceFormatter
          amount={price + (discount * price) / 100}
          className={twMerge(
            "text-sm text-muted-foreground line-through",
            className,
          )}
        />
      )}
    </div>
  );
};

export default PriceView;
