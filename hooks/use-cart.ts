"use client";

import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Product } from "@/sanity.types";
import useStore, { type CartItem } from "@/store";

interface CartSlice {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => void;
}

interface UseCartResult {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  subTotalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  resetCart: () => void;
  getItemQuantity: (productId: string) => number;
  isEmpty: boolean;
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => void;
}

export function useCart(): UseCartResult {
  const {
    items,
    addItem,
    removeItem,
    deleteCartProduct,
    resetCart,
    favoriteProduct,
    addToFavorite,
  } = useStore(
    useShallow((state: CartSlice) => ({
      items: state.items,
      addItem: state.addItem,
      removeItem: state.removeItem,
      deleteCartProduct: state.deleteCartProduct,
      resetCart: state.resetCart,
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
    return total;
  }, [items]);

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

  return {
    items,
    itemCount,
    totalPrice,
    subTotalPrice,
    addItem,
    removeItem,
    deleteItem: deleteCartProduct,
    resetCart,
    getItemQuantity,
    isEmpty: items.length === 0,
    favoriteProduct,
    addToFavorite,
  };
}
