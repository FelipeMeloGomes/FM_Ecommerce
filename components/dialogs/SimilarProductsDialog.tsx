"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import PriceFormatter from "@/components/PriceFormatter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SIMILAR_PRODUCTS_QUERY } from "@/sanity/queries/query";
import type { Product } from "@/sanity.types";

interface SimilarProduct {
  _id: string;
  name?: string;
  slug?: { current?: string };
  price?: number;
  discount?: number;
  stock?: number;
  images?: Array<{ asset?: { _ref: string } }>;
}

const SimilarProductsSkeleton = () => (
  <div className="space-y-3 py-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 animate-pulse">
        <div className="w-20 h-20 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

const SimilarProductCard = ({ product }: { product: SimilarProduct }) => {
  const discountPercent = product.discount ?? 0;
  const hasDiscount = discountPercent > 0;
  const isOutOfStock = product.stock === 0;
  const finalPrice =
    hasDiscount && product.price
      ? product.price * (1 - discountPercent / 100)
      : product.price;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="group flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
        {product.images?.[0] ? (
          <Image
            src={urlFor(product.images[0]).url()}
            alt={product.name || "product"}
            fill
            sizes="80px"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sem imagem
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-shop_orange transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm font-bold text-shop_dark_green">
            <PriceFormatter amount={finalPrice} />
          </span>
          {hasDiscount && product.price && (
            <span className="text-xs text-muted-foreground line-through">
              <PriceFormatter amount={product.price} />
            </span>
          )}
        </div>
        <p
          className={`text-xs mt-1 ${
            isOutOfStock ? "text-destructive" : "text-emerald-600"
          }`}
        >
          {isOutOfStock ? "Indisponível" : "Em estoque"}
        </p>
      </div>
    </Link>
  );
};

interface SimilarProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Pick<Product, "_id" | "categories">;
}

export function SimilarProductsDialog({
  open,
  onOpenChange,
  product,
}: SimilarProductsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const categoryId = product.categories?.[0]?._ref ?? null;
  const hasCategory = categoryId !== null;

  const fetchSimilarProducts = useCallback(async () => {
    if (!categoryId || hasLoaded) return;

    setLoading(true);
    try {
      const data = await client.fetch<SimilarProduct[]>(
        SIMILAR_PRODUCTS_QUERY,
        {
          currentProductId: product._id,
          categoryId,
        },
      );
      setSimilarProducts(data || []);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error fetching similar products:", error);
      setSimilarProducts([]);
    } finally {
      setLoading(false);
    }
  }, [product._id, categoryId, hasLoaded]);

  useEffect(() => {
    if (open && hasCategory && !hasLoaded) {
      fetchSimilarProducts();
    }
  }, [open, hasCategory, hasLoaded, fetchSimilarProducts]);

  const handleOpenChange = (newOpen: boolean) => {
    startTransition(() => {
      onOpenChange(newOpen);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`max-w-2xl ${isPending || loading ? "cursor-wait" : ""}`}
      >
        <DialogHeader>
          <DialogTitle>Produtos Similares</DialogTitle>
          <DialogDescription>
            Outros produtos da mesma categoria que você pode gostar
          </DialogDescription>
        </DialogHeader>
        {!hasCategory ? (
          <p className="text-sm text-muted-foreground py-4">
            Este produto não possui categorias associadas.
          </p>
        ) : loading ? (
          <SimilarProductsSkeleton />
        ) : similarProducts.length > 0 ? (
          <div className="space-y-1 max-h-96 overflow-y-auto py-2">
            {similarProducts.map((p) => (
              <SimilarProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            Nenhum produto similar encontrado.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
