import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = React.memo(({ amount, className }: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span
      className={twMerge("text-base font-semibold text-foreground", className)}
    >
      {formattedPrice}
    </span>
  );
});

PriceFormatter.displayName = "PriceFormatter";

export default PriceFormatter;
