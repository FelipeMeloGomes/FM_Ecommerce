"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  resetWishlist,
} from "@/actions/wishlistActions";
import type { Product } from "@/sanity.types";
import { useLocalWishlist } from "./useLocalWishlist";

interface UseWishlistReturn {
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => void;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  isLoading: boolean;
}

export function useWishlist(): UseWishlistReturn {
  const { isSignedIn } = useAuth();
  const [serverFavorites, setServerFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    localFavorites,
    addToLocalFavorite,
    removeFromLocalFavorite,
    clearLocalFavorites,
    getLocalWishlist,
    migrateToServer,
  } = useLocalWishlist();

  const favoriteProduct = isSignedIn ? serverFavorites : localFavorites;

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadWishlist = async () => {
      try {
        const products = await getWishlist();

        if (cancelled) return;

        const uniqueProducts = products.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p._id === product._id),
        );

        setServerFavorites(uniqueProducts);

        const local = getLocalWishlist();
        if (local.length > 0) {
          await migrateToServer(async (productId) => {
            await addToWishlist(productId);
          });
          const updatedProducts = await getWishlist();
          if (!cancelled) {
            const uniqueUpdated = updatedProducts.filter(
              (product, index, self) =>
                index === self.findIndex((p) => p._id === product._id),
            );
            setServerFavorites(uniqueUpdated);
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, getLocalWishlist, migrateToServer]);

  const addToFavorite = useCallback(
    (product: Product) => {
      if (!product._id) return;

      if (isSignedIn) {
        setServerFavorites((prev) => {
          if (prev.some((p) => p._id === product._id)) {
            return prev;
          }
          return [...prev, product];
        });

        addToWishlist(product._id)
          .then(() => {
            toast.success("Produto adicionado aos favoritos!");
          })
          .catch(() => {
            setServerFavorites((prev) =>
              prev.filter((p) => p._id !== product._id),
            );
            toast.error("Erro ao adicionar aos favoritos");
          });
      } else {
        addToLocalFavorite(product);
      }
    },
    [isSignedIn, addToLocalFavorite],
  );

  const removeFromFavorite = useCallback(
    (productId: string) => {
      if (isSignedIn) {
        const product = serverFavorites.find((p) => p._id === productId);
        setServerFavorites((prev) => prev.filter((p) => p._id !== productId));

        removeFromWishlist(productId)
          .then(() => {
            toast.success("Produto removido dos favoritos!");
          })
          .catch(() => {
            if (product) {
              setServerFavorites((prev) => [...prev, product]);
            }
            toast.error("Erro ao remover dos favoritos");
          });
      } else {
        removeFromLocalFavorite(productId);
      }
    },
    [isSignedIn, serverFavorites, removeFromLocalFavorite],
  );

  const resetFavorite = useCallback(() => {
    if (isSignedIn) {
      const previousProducts = [...serverFavorites];
      setServerFavorites([]);

      resetWishlist()
        .then(() => {
          toast.success("Lista de favoritos limpa!");
        })
        .catch(() => {
          setServerFavorites(previousProducts);
          toast.error("Erro ao limpar favoritos");
        });
    } else {
      clearLocalFavorites();
    }
  }, [isSignedIn, serverFavorites, clearLocalFavorites]);

  const uniqueFavorites = favoriteProduct.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p._id === product._id),
  );

  return {
    favoriteProduct: uniqueFavorites,
    addToFavorite,
    removeFromFavorite,
    resetFavorite,
    isLoading,
  };
}
