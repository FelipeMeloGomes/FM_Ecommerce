import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn, getStockStatus } from "@/lib/stock";

const stockBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        high: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        low: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        out: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "high",
    },
  },
);

export interface StockBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stockBadgeVariants> {
  stock: number | undefined | null;
  showCount?: boolean;
}

function StockBadge({
  className,
  variant,
  stock,
  showCount = true,
  ...props
}: StockBadgeProps) {
  const status = variant ?? getStockStatus(stock);

  const getLabel = () => {
    if (!stock || stock === 0) return "Indisponível";
    if (!showCount) return "Em estoque";
    return `${stock} ${stock === 1 ? "unidade" : "unidades"}`;
  };

  return (
    <span
      className={cn(stockBadgeVariants({ variant: status }), className)}
      {...props}
    >
      {getLabel()}
    </span>
  );
}

export { StockBadge, stockBadgeVariants };
