"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ServerResult } from "@/lib/server-result";
import type { Product } from "@/sanity.types";

const LOCAL_WISHLIST_KEY = "fm-wishlist";

interface CartStore {
  state?: {
    favoriteProduct?: Product[];
  };
}

function getStoredWishlist(): Product[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    const cartStore = localStorage.getItem("cart-store");
    if (cartStore) {
      const parsed: CartStore = JSON.parse(cartStore);
      if (parsed?.state?.favoriteProduct) {
        return parsed.state.favoriteProduct;
      }
    }
  } catch {
    // Silent fail
  }
  return [];
}

interface UseLocalWishlistReturn {
  localFavorites: Product[];
  addToLocalFavorite: (product: Product) => void;
  removeFromLocalFavorite: (productId: string) => void;
  clearLocalFavorites: () => void;
  getLocalWishlist: () => Product[];
  migrateToServer: (
    addToServerWishlist: (productId: string) => Promise<ServerResult<void>>,
  ) => Promise<void>;
}

export function useLocalWishlist(): UseLocalWishlistReturn {
  const [localFavorites, setLocalFavorites] = useState<Product[]>(() =>
    getStoredWishlist(),
  );

  const getLocalWishlist = useCallback((): Product[] => {
    return getStoredWishlist();
  }, []);

  const saveToLocal = useCallback((products: Product[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(products));
      setLocalFavorites(products);
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    const stored = getStoredWishlist();
    setLocalFavorites(stored);
  }, []);

  const addToLocalFavorite = useCallback(
    (product: Product) => {
      const current = getLocalWishlist();
      if (current.some((p) => p._id === product._id)) return;

      const updated = [...current, product];
      saveToLocal(updated);
      toast.success("Produto adicionado aos favoritos!");
    },
    [getLocalWishlist, saveToLocal],
  );

  const removeFromLocalFavorite = useCallback(
    (productId: string) => {
      const current = getLocalWishlist();
      const updated = current.filter((p) => p._id !== productId);
      saveToLocal(updated);
      toast.success("Produto removido dos favoritos!");
    },
    [getLocalWishlist, saveToLocal],
  );

  const clearLocalFavorites = useCallback(() => {
    saveToLocal([]);
    toast.success("Lista de favoritos limpa!");
  }, [saveToLocal]);

  const migrateToServer = useCallback(
    async (
      addToServerWishlist: (productId: string) => Promise<ServerResult<void>>,
    ) => {
      const local = getLocalWishlist();
      if (local.length === 0) return;

      let migrated = 0;
      let failed = 0;

      for (const product of local) {
        if (product._id) {
          try {
            const result = await addToServerWishlist(product._id);
            if (result.success) {
              migrated++;
            } else {
              failed++;
            }
          } catch {
            failed++;
          }
        }
      }

      if (migrated > 0) {
        saveToLocal([]);

        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("cart-store");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed?.state?.favoriteProduct) {
                parsed.state.favoriteProduct = [];
                localStorage.setItem("cart-store", JSON.stringify(parsed));
              }
            }
          } catch {
            // Silent fail
          }
        }

        toast.success(`${migrated} item(s) migrados para sua conta!`);
      }

      if (failed > 0) {
        toast.error(`${failed} item(s) não puderam ser migrados`);
      }
    },
    [getLocalWishlist, saveToLocal],
  );

  return {
    localFavorites,
    addToLocalFavorite,
    removeFromLocalFavorite,
    clearLocalFavorites,
    getLocalWishlist,
    migrateToServer,
  };
}
