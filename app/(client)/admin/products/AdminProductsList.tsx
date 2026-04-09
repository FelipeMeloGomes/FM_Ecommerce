"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin/pagination";
import { AdminSearch } from "@/components/ui/admin-search";
import { Button } from "@/components/ui/button";
import type { Product } from "@/core/products/Product";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { normalizeString } from "@/lib/string";
import { urlFor } from "@/sanity/lib/image";

interface AdminProductsListProps {
  initialProducts: Product[];
}

const PAGE_SIZE = 10;

export function AdminProductsList({ initialProducts }: AdminProductsListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return initialProducts;
    const q = normalizeString(query);
    return initialProducts.filter(
      (p) =>
        normalizeString(p.name).includes(q) ||
        normalizeString(p.description ?? "").includes(q),
    );
  }, [initialProducts, query]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, []);

  const handleDelete = useCallback(
    (id: string | undefined) => {
      if (!id) return;

      confirmToast({
        message: "Tem certeza que deseja deletar este produto?",
        onConfirm: async () => {
          try {
            await apiRequest(`/api/admin/products/${id}`, {
              method: "DELETE",
            });

            toast.success("Produto deletado com sucesso!");
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Erro ao deletar produto",
            );
          }
        },
      });
    },
    [router],
  );

  const handleDeleteProduct = useCallback(
    (id: string | undefined) => () => handleDelete(id),
    [handleDelete],
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Produtos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie o catálogo de produtos
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="
                border-input
                text-muted-foreground
                hover:bg-muted hover:text-foreground
                transition-all duration-200
              "
            >
              <Link href="/admin/brands">Gerenciar Marcas</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="
                border-input
                text-muted-foreground
                hover:bg-muted hover:text-foreground
                transition-all duration-200
              "
            >
              <Link href="/admin/categories">Gerenciar Categorias</Link>
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
          <AdminSearch
            query={query}
            onQueryChange={handleQueryChange}
            placeholder="Buscar produtos..."
            createLabel="Novo produto"
            createHref="/admin/add"
          />

          <div className="flex items-center justify-between py-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredProducts.length}
              </span>{" "}
              de {initialProducts.length} produtos
            </p>
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages || 1}
            </span>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedProducts.map((product) => {
                const imageUrl = product.images?.[0]?.asset?._ref
                  ? urlFor(product.images[0].asset._ref).url()
                  : "/placeholder.png";

                return (
                  <div
                    key={product._id}
                    className="
                      group
                      bg-muted/30
                      rounded-lg
                      border border-border
                      overflow-hidden
                      transition-all duration-200
                      hover:border-ring/30
                      hover:shadow-md hover:shadow-ring/5
                    "
                  >
                    <div className="aspect-[4/3] relative bg-background">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-3"
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center">
                          <span className="text-destructive-foreground text-sm font-medium px-3 py-1 bg-destructive rounded">
                            Esgotado
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-card-foreground">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </span>
                        <span
                          className={`
                            text-xs px-2 py-1 rounded-full font-medium
                            ${
                              product.stock > 10
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : product.stock > 0
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }
                          `}
                        >
                          {product.stock} unidades
                        </span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="
                            flex-1 h-9
                            border-input
                            text-muted-foreground
                            hover:bg-primary hover:text-primary-foreground
                            hover:border-primary
                            transition-all duration-200
                          "
                        >
                          <Link href={`/admin/edit/${product._id}`}>
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDeleteProduct(product._id)}
                          className="
                            h-9 w-9
                            text-muted-foreground hover:text-destructive
                            hover:bg-destructive/10
                            transition-all duration-200
                          "
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Ícone de busca</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground font-medium">
                Nenhum produto encontrado
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {query
                  ? `Não há resultados para "${query}"`
                  : "Adicione produtos ao catálogo"}
              </p>
            </div>
          )}

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
