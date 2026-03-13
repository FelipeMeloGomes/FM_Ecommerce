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
import type { Brand } from "@/core/brands/Brand";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

interface AdminBrandsListProps {
  initialBrands: Brand[];
}

export default function AdminBrandsList({
  initialBrands,
}: AdminBrandsListProps) {
  const [allBrands, setAllBrands] = useState<Brand[]>(initialBrands);
  const [filtered, setFiltered] = useState<Brand[]>(initialBrands);
  const router = useRouter();

  useEffect(() => {
    setAllBrands(initialBrands);
    setFiltered(initialBrands);
  }, [initialBrands]);

  const handleFilter = useCallback((result: Brand[]) => {
    setFiltered(result);
  }, []);

  const handleDelete = (id: string | undefined) => {
    if (!id) return;

    confirmToast({
      message: "Tem certeza que deseja deletar esta marca?",
      onConfirm: async () => {
        try {
          await apiRequest<{ success: true }>(`/api/admin/brands/${id}`, {
            method: "DELETE",
          });

          setAllBrands((current) => current.filter((b) => b._id !== id));
          setFiltered((current) => current.filter((b) => b._id !== id));

          toast.success("Marca deletada com sucesso!");
          router.refresh();
        } catch (error) {
          console.error("Erro no delete:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Erro ao deletar marca";
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Marcas</h1>
        </div>

        <AdminSearch
          items={allBrands}
          searchKeys={["title"]}
          onFilter={handleFilter}
          placeholder="Buscar marcas..."
          createLabel="Nova marca"
          createHref="/admin/add/brands"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((brand) => {
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

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma marca encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
