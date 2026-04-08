import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StockStatus = "high" | "low" | "out";

export function getStockStatus(stock: number | undefined | null): StockStatus {
  if (!stock || stock === 0) return "out";
  if (stock <= 10) return "low";
  return "high";
}

export function getStockLabel(stock: number | undefined | null): string {
  if (!stock || stock === 0) return "Indisponível";
  if (stock <= 10) return `${stock} unidades`;
  return `${stock} unidades`;
}

export function getStockColor(stock: number | undefined | null): string {
  const status = getStockStatus(stock);
  switch (status) {
    case "out":
      return "text-destructive";
    case "low":
      return "text-amber-600";
    case "high":
      return "text-emerald-600";
  }
}
