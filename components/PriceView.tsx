import React from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}

const PriceView = React.memo(({ price, discount, className }: Props) => {
  return (
    <div className="flex flex-col gap-0.5">
      <PriceFormatter
        amount={price}
        className={cn(
          "text-lg lg:text-xl font-bold text-shop_dark_green",
          className,
        )}
      />
      {price && discount && (
        <PriceFormatter
          amount={price + (discount * price) / 100}
          className={twMerge(
            "text-xs lg:text-sm text-muted-foreground line-through",
            className,
          )}
        />
      )}
    </div>
  );
});

PriceView.displayName = "PriceView";

export default PriceView;
