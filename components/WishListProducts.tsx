"use client";

import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { confirmToast } from "@/helpers/confirmToast";
import { urlFor } from "@/sanity/lib/image";
import type { Product } from "@/sanity.types";
import useStore from "@/store";
import AddToCartButton from "./AddToCartButton";
import Container from "./Container";
import PriceFormatter from "./PriceFormatter";
import { Button } from "./ui/button";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
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
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Imagem</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Tipo</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Preço</th>
                  <th className="p-2 text-center md:text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  ?.map((product: Product) => (
                    <tr key={product?._id} className="border-b">
                      <td className="px-2 py-4 flex items-center gap-2">
                        <X
                          onClick={() => {
                            removeFromFavorite(product?._id);
                            toast.success(
                              "Produto removido da lista de favoritos",
                            );
                          }}
                          size={18}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect"
                        />
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="border rounded-md group hidden md:inline-flex"
                          >
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt={"product image"}
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product?.name}</p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories.map((cat) => cat).join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.variant}
                      </td>
                      <td
                        className={`p-2 w-24 ${(product?.stock as number) > 0 ? "text-green-600" : "text-red-600"} font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "Em Estoque"
                          : "Fora de Estoque"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2">
            {visibleProducts < favoriteProduct?.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Carregar mais
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button
                  onClick={() => setVisibleProducts(10)}
                  variant="outline"
                >
                  Carregar menos
                </Button>
              </div>
            )}
          </div>
          {favoriteProduct?.length > 0 && (
            <Button
              onClick={handleResetWishlist}
              className={`mb-5 font-semibold ${!showLoadMore && !showLoadLess ? "mt-5" : ""}`}
              variant="destructive"
              size="lg"
            >
              Redefinir lista de favoritos
            </Button>
          )}
        </>
      ) : (
        <div className="flex min-h-100 flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Sua lista de favoritos está vazia
            </h2>
            <p className="text-sm text-muted-foreground">
              Os itens adicionados à sua lista de favoritos aparecerão aqui.
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Continue Comprando</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
