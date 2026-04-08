"use client";

import type { Product } from "@/sanity.types";
import useStore, { type CartItem } from "@/store";

interface UseCartResult {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  subTotalPrice: number;
  shipping: { price: number; deliveryDays: number } | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteItem: (productId: string) => void;
  setShipping: (
    shipping: { price: number; deliveryDays: number } | null,
  ) => void;
  resetCart: () => void;
  getItemQuantity: (productId: string) => number;
  isEmpty: boolean;
}

export function useCart(): UseCartResult {
  const items = useStore((state) => state.items);
  const shipping = useStore((state) => state.shipping);
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);
  const deleteCartProduct = useStore((state) => state.deleteCartProduct);
  const resetCart = useStore((state) => state.resetCart);
  const setShipping = useStore((state) => state.setShipping);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const getSubTotalPrice = useStore((state) => state.getSubTotalPrice);
  const getItemCount = useStore((state) => state.getItemCount);

  const itemCount = items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0,
  );

  const getItemQuantity = (productId: string) => {
    return getItemCount(productId);
  };

  return {
    items,
    itemCount,
    totalPrice: getTotalPrice(),
    subTotalPrice: getSubTotalPrice(),
    shipping: shipping
      ? {
          price: shipping.price,
          deliveryDays: shipping.deliveryDays,
        }
      : null,
    addItem,
    removeItem,
    deleteItem: deleteCartProduct,
    setShipping: (info) =>
      setShipping(
        info
          ? {
              service: "standard",
              price: info.price,
              deliveryDays: info.deliveryDays,
            }
          : null,
      ),
    resetCart,
    getItemQuantity,
    isEmpty: items.length === 0,
  };
}
