"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/core/products/Product";
import { confirmToast } from "@/helpers/confirmToast";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

interface AdminProductsListProps {
  initialProducts: Product[];
}

export function AdminProductsList({ initialProducts }: AdminProductsListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const router = useRouter();

  const handleDelete = (id: string | undefined) => {
    if (!id) return;

    confirmToast({
      message: "Tem certeza que deseja deletar este produto?",
      onConfirm: async () => {
        try {
          await apiRequest(`/api/admin/products/${id}`, {
            method: "DELETE",
          });

          setProducts((current) => current.filter((p) => p._id !== id));

          toast.success("Produto deletado com sucesso!");
          router.refresh();
        } catch (error) {
          console.error("Erro no delete:", error);

          toast.error(
            error instanceof Error ? error.message : "Erro ao deletar produto",
          );
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
          <Button asChild>
            <Link href="/admin/add">Novo Produto</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
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

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
