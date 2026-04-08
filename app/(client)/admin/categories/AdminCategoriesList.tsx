"use client";

import { Edit, Star, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminPagination } from "@/components/admin/pagination";
import { AdminSearch } from "@/components/ui/admin-search";
import { Button } from "@/components/ui/button";
import type { Category } from "@/core/categories/Category";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { normalizeString } from "@/lib/string";
import { urlFor } from "@/sanity/lib/image";

interface AdminCategoriesListProps {
  initialCategories: Category[];
}

const PAGE_SIZE = 10;

export default function AdminCategoriesList({
  initialCategories,
}: AdminCategoriesListProps) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return initialCategories;
    const q = normalizeString(query);
    return initialCategories.filter(
      (c) =>
        normalizeString(c.title).includes(q) ||
        normalizeString(c.description ?? "").includes(q),
    );
  }, [initialCategories, query]);

  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, currentPage]);

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
        message: "Tem certeza que deseja deletar esta categoria?",
        onConfirm: async () => {
          try {
            const _response = await apiRequest<{ success: true }>(
              `/api/admin/categories/${id}`,
              {
                method: "DELETE",
              },
            );

            toast.success("Categoria deletada com sucesso!");
            router.refresh();
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Erro ao deletar categoria";
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
              Categorias
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as categorias do catálogo
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm">
          <AdminSearch
            query={query}
            onQueryChange={handleQueryChange}
            placeholder="Buscar categorias..."
            createLabel="Nova categoria"
            createHref="/admin/add/categories"
          />

          <div className="flex items-center justify-between py-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filteredCategories.length}
              </span>{" "}
              de {initialCategories.length} categorias
            </p>
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages || 1}
            </span>
          </div>

          {paginatedCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedCategories.map((category) => {
                const imageUrl = category.image?.asset?._ref
                  ? urlFor(category.image.asset._ref).url()
                  : "/placeholder.png";

                return (
                  <div
                    key={category._id}
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
                        alt={category.title}
                        fill
                        className="object-cover"
                        suppressHydrationWarning
                      />
                      {category.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Star className="w-3 h-3 fill-current" />
                            Destaque
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-medium text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        {category.range && (
                          <span className="text-muted-foreground">
                            <span className="text-muted-foreground/70">
                              A partir de{" "}
                            </span>
                            <span className="font-medium text-foreground">
                              R$ {category.range}
                            </span>
                          </span>
                        )}
                        {category.featured && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-primary/10 text-primary">
                            Destaque
                          </span>
                        )}
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
                          <Link href={`/admin/edit/categories/${category._id}`}>
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category._id)}
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
                Nenhuma categoria encontrada
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {query
                  ? `Não há resultados para "${query}"`
                  : "Adicione categorias ao catálogo"}
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
