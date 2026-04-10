"use client";

import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import type { Product } from "@/sanity.types";
import useStore, { type CartItem } from "@/store";

interface ShippingInfo {
  price: number;
  deliveryDays: number;
}

interface CartSlice {
  items: CartItem[];
  shipping: ShippingQuote | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  setShipping: (shipping: ShippingQuote | null) => void;
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => void;
}

interface UseCartResult {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  subTotalPrice: number;
  shipping: ShippingInfo | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  setShipping: (shipping: ShippingInfo | null) => void;
  resetCart: () => void;
  getItemQuantity: (productId: string) => number;
  isEmpty: boolean;
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => void;
}

export function useCart(): UseCartResult {
  const {
    items,
    shipping,
    addItem,
    removeItem,
    deleteCartProduct,
    resetCart,
    setShipping,
    favoriteProduct,
    addToFavorite,
  } = useStore(
    useShallow((state: CartSlice) => ({
      items: state.items,
      shipping: state.shipping,
      addItem: state.addItem,
      removeItem: state.removeItem,
      deleteCartProduct: state.deleteCartProduct,
      resetCart: state.resetCart,
      setShipping: state.setShipping,
      favoriteProduct: state.favoriteProduct,
      addToFavorite: state.addToFavorite,
    })),
  );

  const itemCount = useMemo(() => {
    let total = 0;
    for (const item of items) {
      total += item.quantity;
    }
    return total;
  }, [items]);

  const totalPrice = useMemo(() => {
    let total = 0;
    for (const item of items) {
      total += (item.product.price ?? 0) * item.quantity;
    }
    return total + (shipping?.price ?? 0);
  }, [items, shipping]);

  const subTotalPrice = useMemo(() => {
    let total = 0;
    for (const item of items) {
      const price = item.product.price ?? 0;
      const discount = ((item.product.discount ?? 0) * price) / 100;
      const discountedPrice = price + discount;
      total += discountedPrice * item.quantity;
    }
    return total;
  }, [items]);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      for (const item of items) {
        if (item.product._id === productId) {
          return item.quantity;
        }
      }
      return 0;
    },
    [items],
  );

  const setShippingFn = useCallback(
    (info: ShippingInfo | null) => {
      setShipping(
        info
          ? {
              service: "standard",
              price: info.price,
              deliveryDays: info.deliveryDays,
            }
          : null,
      );
    },
    [setShipping],
  );

  return {
    items,
    itemCount,
    totalPrice,
    subTotalPrice,
    shipping: shipping
      ? {
          price: shipping.price,
          deliveryDays: shipping.deliveryDays,
        }
      : null,
    addItem,
    removeItem,
    deleteItem: deleteCartProduct,
    setShipping: setShippingFn,
    resetCart,
    getItemQuantity,
    isEmpty: items.length === 0,
    favoriteProduct,
    addToFavorite,
  };
}
