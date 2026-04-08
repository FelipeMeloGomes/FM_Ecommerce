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
import type { Brand } from "@/core/brands/Brand";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { normalizeString } from "@/lib/string";
import { urlFor } from "@/sanity/lib/image";

interface AdminBrandsListProps {
  initialBrands: Brand[];
}

const PAGE_SIZE = 10;

export default function AdminBrandsList({
  initialBrands,
}: AdminBrandsListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredBrands = useMemo(() => {
    if (!query.trim()) return initialBrands;
    const q = normalizeString(query);
    return initialBrands.filter(
      (b) =>
        normalizeString(b.title).includes(q) ||
        normalizeString(b.description ?? "").includes(q),
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
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Marcas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as marcas do catálogo
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
          <AdminSearch
            query={query}
            onQueryChange={handleQueryChange}
            placeholder="Buscar marcas..."
            createLabel="Nova marca"
            createHref="/admin/add/brands"
          />

          <div className="flex items-center justify-between py-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredBrands.length}
              </span>{" "}
              de {initialBrands.length} marcas
            </p>
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages || 1}
            </span>
          </div>

          {paginatedBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedBrands.map((brand) => {
                const imageUrl = brand.image?.asset?._ref
                  ? urlFor(brand.image.asset._ref).url()
                  : "/placeholder.png";

                return (
                  <div
                    key={brand._id}
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
                    <div className="aspect-[4/3] relative bg-background flex items-center justify-center">
                      <Image
                        src={imageUrl}
                        alt={brand.title}
                        fill
                        className="object-contain p-4"
                        suppressHydrationWarning
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {brand.title}
                      </h3>
                      {brand.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {brand.description}
                        </p>
                      )}
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
                          <Link href={`/admin/edit/brands/${brand._id}`}>
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(brand._id)}
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
                Nenhuma marca encontrada
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {query
                  ? `Não há resultados para "${query}"`
                  : "Adicione marcas ao catálogo"}
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
