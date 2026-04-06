"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  resetWishlist,
} from "@/actions/wishlistActions";
import type { Product } from "@/sanity.types";

interface UseWishlistReturn {
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => Promise<void>;
  resetFavorite: () => Promise<void>;
  isLoading: boolean;
}

export function useWishlist(): UseWishlistReturn {
  const [favoriteProduct, setFavoriteProduct] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const migrateLocalStorage = useCallback(
    async (currentProducts: Product[]) => {
      if (typeof window === "undefined") return;

      try {
        const stored = localStorage.getItem("cart-store");
        if (!stored) return;

        const parsed = JSON.parse(stored);
        const localFavorites = parsed?.state?.favoriteProduct as
          | Product[]
          | undefined;

        if (localFavorites && localFavorites.length > 0) {
          const existingIds = new Set(currentProducts.map((p) => p._id));

          for (const product of localFavorites) {
            if (product._id && !existingIds.has(product._id)) {
              try {
                await addToWishlist(product._id);
              } catch (error) {
                console.error("Error migrating product:", product._id, error);
              }
            }
          }

          const newState = { ...parsed };
          newState.state = { ...parsed.state, favoriteProduct: [] };
          localStorage.setItem("cart-store", JSON.stringify(newState));

          const updatedProducts = await getWishlist();
          setFavoriteProduct(updatedProducts);

          toast.success("Favoritos migraodos com sucesso!");
        }
      } catch (error) {
        console.error("Error migrating localStorage:", error);
      }
    },
    [],
  );

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const products = await getWishlist();
        setFavoriteProduct(products);
        migrateLocalStorage(products);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [migrateLocalStorage]);

  const addToFavorite = async (product: Product) => {
    if (!product._id) return;

    const isAlreadyFavorite = favoriteProduct.some(
      (p) => p._id === product._id,
    );

    setFavoriteProduct((prev) => {
      if (isAlreadyFavorite) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });

    try {
      if (isAlreadyFavorite) {
        await removeFromWishlist(product._id);
        toast.success("Produto removido dos favoritos!");
      } else {
        await addToWishlist(product._id);
        toast.success("Produto adicionado aos favoritos!");
      }
    } catch (_error) {
      setFavoriteProduct((prev) => {
        if (isAlreadyFavorite) {
          return [...prev, product];
        }
        return prev.filter((p) => p._id !== product._id);
      });
      toast.error("Erro ao atualizar favoritos");
    }
  };

  const removeFromFavorite = async (productId: string) => {
    const product = favoriteProduct.find((p) => p._id === productId);

    setFavoriteProduct((prev) => prev.filter((p) => p._id !== productId));

    try {
      await removeFromWishlist(productId);
      toast.success("Produto removido dos favoritos!");
    } catch (_error) {
      if (product) {
        setFavoriteProduct((prev) => [...prev, product]);
      }
      toast.error("Erro ao remover produto");
    }
  };

  const resetFavorite = async () => {
    const previousProducts = [...favoriteProduct];
    setFavoriteProduct([]);

    try {
      await resetWishlist();
      toast.success("Lista de favoritos limpa!");
    } catch (_error) {
      setFavoriteProduct(previousProducts);
      toast.error("Erro ao limpar favoritos");
    }
  };

  return {
    favoriteProduct,
    addToFavorite,
    removeFromFavorite,
    resetFavorite,
    isLoading,
  };
}
