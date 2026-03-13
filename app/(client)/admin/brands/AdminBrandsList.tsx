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
import type { Brand } from "@/core/brands/Brand";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

interface AdminBrandsListProps {
  initialBrands: Brand[];
}

const PAGE_SIZE = 10;

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function AdminBrandsList({
  initialBrands,
}: AdminBrandsListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredBrands = useMemo(() => {
    if (!query.trim()) return initialBrands;
    const q = normalize(query);
    return initialBrands.filter(
      (b) =>
        normalize(b.title).includes(q) ||
        normalize(b.description ?? "").includes(q),
    );
  }, [initialBrands, query]);

  const totalPages = Math.ceil(filteredBrands.length / PAGE_SIZE);

  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBrands.slice(start, start + PAGE_SIZE);
  }, [filteredBrands, currentPage]);

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
        message: "Tem certeza que deseja deletar esta marca?",
        onConfirm: async () => {
          try {
            await apiRequest<{ success: true }>(`/api/admin/brands/${id}`, {
              method: "DELETE",
            });

            toast.success("Marca deletada com sucesso!");
            router.refresh();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Erro ao deletar marca";
            toast.error(errorMessage);
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
          <h1 className="text-3xl font-semibold tracking-tight">Marcas</h1>
        </div>

        <AdminSearch
          query={query}
          onQueryChange={handleQueryChange}
          placeholder="Buscar marcas..."
          createLabel="Nova marca"
          createHref="/admin/add/brands"
        />

        <p className="text-sm text-muted-foreground">
          {filteredBrands.length} de {initialBrands.length} marcas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBrands.map((brand) => {
            const imageUrl = brand.image?.asset?._ref
              ? urlFor(brand.image.asset._ref).url()
              : "/placeholder.png";

            return (
              <Card key={brand._id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={imageUrl}
                    alt={brand.title}
                    fill
                    className="object-contain p-4"
                    suppressHydrationWarning
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{brand.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brand.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/admin/edit/brands/${brand._id}`}>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(brand._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {paginatedBrands.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma marca encontrada</p>
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
