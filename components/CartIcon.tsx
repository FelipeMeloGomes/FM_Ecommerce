"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks";

const CartIcon = () => {
  const { items } = useCart();
  return (
    <Link href="/cart" className="relative" aria-label="Abrir carrinho">
      <ShoppingBag
        className="w-5 h-5 hover:text-shop_light_green hoverEffect"
        aria-hidden="true"
      />
      <span
        suppressHydrationWarning
        className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center"
      >
        {items.length}
      </span>
    </Link>
  );
};

export default CartIcon;
