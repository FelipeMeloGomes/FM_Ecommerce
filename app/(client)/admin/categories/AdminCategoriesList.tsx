"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminSearch } from "@/components/ui/admin-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/core/categories/Category";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

interface AdminCategoriesListProps {
  initialCategories: Category[];
}

export default function AdminCategoriesList({
  initialCategories,
}: AdminCategoriesListProps) {
  const [allCategories, setAllCategories] =
    useState<Category[]>(initialCategories);
  const [filtered, setFiltered] = useState<Category[]>(initialCategories);
  const router = useRouter();

  useEffect(() => {
    setAllCategories(initialCategories);
    setFiltered(initialCategories);
  }, [initialCategories]);

  const handleFilter = useCallback((result: Category[]) => {
    setFiltered(result);
  }, []);

  const handleDelete = (id: string | undefined) => {
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

          setAllCategories((current) => current.filter((c) => c._id !== id));
          setFiltered((current) => current.filter((c) => c._id !== id));

          toast.success("Categoria deletada com sucesso!");
          router.refresh();
        } catch (error) {
          console.error("Erro no delete:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao deletar categoria";
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Categorias</h1>
        </div>

        <AdminSearch
          items={allCategories}
          searchKeys={["title", "slug"]}
          onFilter={handleFilter}
          placeholder="Buscar categorias..."
          createLabel="Nova categoria"
          createHref="/admin/add/categories"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((category) => {
            const imageUrl = category.image?.asset?._ref
              ? urlFor(category.image.asset._ref).url()
              : "/placeholder.png";

            return (
              <Card key={category._id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={imageUrl}
                    alt={category.title}
                    fill
                    className="object-cover"
                    suppressHydrationWarning
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    {category.range && (
                      <span className="text-muted-foreground">
                        A partir de R$ {category.range}
                      </span>
                    )}
                    {category.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Destaque
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/admin/edit/categories/${category._id}`}>
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma categoria encontrada
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
