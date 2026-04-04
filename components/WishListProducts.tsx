"use client";

import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { confirmToast } from "@/helpers/confirmToast";
import { useWishlist } from "@/hooks/useWishlist";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/sanity.types";
import AddToCartButton from "./AddToCartButton";
import Container from "./Container";
import PriceFormatter from "./PriceFormatter";
import Title from "./Title";
import { Button } from "./ui/button";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite, isLoading } =
    useWishlist();

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Container>
    );
  }

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const showLoadMore = visibleProducts < favoriteProduct?.length;
  const showLoadLess = visibleProducts > 10;

  const handleResetWishlist = () => {
    confirmToast({
      message: "Tem certeza que deseja limpar sua lista de favoritos?",
      onConfirm: () => {
        resetFavorite();
        toast.success("Lista de favoritos limpa com sucesso!");
      },
    });
  };

  return (
    <Container>
      {favoriteProduct?.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <Title className="text-2xl font-semibold">Lista de favoritos</Title>
            <Button
              onClick={handleResetWishlist}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
            >
              Limpar tudo
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Produto
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Categoria
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Tipo
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                      Preço
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {favoriteProduct
                    ?.slice(0, visibleProducts)
                    ?.map((product: Product) => (
                      <tr
                        key={product?._id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                removeFromFavorite(product?._id);
                                toast.success(
                                  "Produto removido da lista de favoritos",
                                );
                              }}
                              className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X size={16} />
                            </button>
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border rounded-lg overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt={product?.name || "product image"}
                                  width={64}
                                  height={64}
                                  className="object-contain w-16 h-16 group-hover:scale-105 transition-transform"
                                />
                              </Link>
                            )}
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="font-medium line-clamp-1 hover:text-primary transition-colors"
                            >
                              {product?.name}
                            </Link>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {product?.categories && (
                            <span className="uppercase text-xs font-medium text-muted-foreground">
                              {product.categories.map((cat) => cat).join(", ")}
                            </span>
                          )}
                        </td>
                        <td className="p-4 capitalize hidden md:table-cell text-sm">
                          {product?.variant}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              (product?.stock as number) > 0
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {(product?.stock as number) > 0
                              ? "Em Estoque"
                              : "Fora de Estoque"}
                          </span>
                        </td>
                        <td className="p-4">
                          <PriceFormatter amount={product?.price} />
                        </td>
                        <td className="p-4">
                          <AddToCartButton
                            product={product}
                            className="w-full sm:w-auto"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {showLoadMore && (
              <Button variant="outline" onClick={loadMore}>
                Carregar mais
              </Button>
            )}
            {showLoadLess && (
              <Button variant="outline" onClick={() => setVisibleProducts(10)}>
                Mostrar menos
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-primary/20" />
            <Heart
              className="h-16 w-16 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sua lista de favoritos está vazia
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Os itens adicionados à sua lista de favoritos aparecerão aqui.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">Começar a comprar</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
