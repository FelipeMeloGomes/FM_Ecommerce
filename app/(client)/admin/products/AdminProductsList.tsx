"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AdminPagination } from "@/components/admin/pagination";
import { AdminSearch } from "@/components/ui/admin-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/core/products/Product";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

interface AdminProductsListProps {
  initialProducts: Product[];
}

const PAGE_SIZE = 10;

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function AdminProductsList({ initialProducts }: AdminProductsListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return initialProducts;
    const q = normalize(query);
    return initialProducts.filter(
      (p) =>
        normalize(p.name).includes(q) ||
        normalize(p.description ?? "").includes(q),
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

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/brands">Gerenciar Marcas</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Gerenciar Categorias</Link>
            </Button>
          </div>
        </div>

        <AdminSearch
          query={query}
          onQueryChange={handleQueryChange}
          placeholder="Buscar produtos..."
          createLabel="Novo produto"
          createHref="/admin/add"
        />

        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} de {initialProducts.length} produtos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => {
            const imageUrl = product.images?.[0]?.asset?._ref
              ? urlFor(product.images[0].asset._ref).url()
              : "/placeholder.png";

            return (
              <Card key={product._id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-medium text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Estoque: {product.stock}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/admin/edit/${product._id}`}>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paginatedProducts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhum produto encontrado.
              </p>
            </CardContent>
          </Card>
        )}

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
