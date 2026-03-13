"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/core/categories/Category";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  type CreateCategoryInput,
  createCategorySchema,
} from "@/lib/schemas/createCategorySchema";
import { urlFor } from "@/sanity/lib/image";

interface EditCategoryFormProps {
  category: Category;
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<ImageFile | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: category.title,
      description: category.description,
      range: category.range,
      featured: category.featured,
    },
  });

  useEffect(() => {
    // Só carrega a imagem inicial se não foi explicitamente removida
    if (category.image?.asset?._ref && !image && !shouldRemoveImage) {
      const previewUrl = urlFor(category.image.asset._ref).url();
      setImage({
        id: category.image._key || crypto.randomUUID(),
        preview: previewUrl,
        file: undefined,
      });
    }

    return () => {
      if (image?.preview && image?.file) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [category.image, shouldRemoveImage, image]);

  const onSubmit = async (data: CreateCategoryInput) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Se quer remover a imagem, envia o sinalizador
    if (shouldRemoveImage) {
      formData.append("_removeImage", "true");
    }

    // Se tem uma nova imagem para upload, envia o arquivo
    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      await apiRequest<{ success: true }>(
        `/api/admin/categories/${category._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      toast.success("Categoria atualizada com sucesso");
      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar categoria";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Editar Categoria</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Título da categoria"
                  {...register("title")}
                />
                <FormError message={errors.title?.message} />
              </div>

              <div>
                <Textarea
                  placeholder="Descrição (opcional)"
                  {...register("description")}
                  rows={4}
                />
                <FormError message={errors.description?.message} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Faixa de preço (opcional)"
                    {...register("range")}
                  />
                  <FormError message={errors.range?.message} />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Destaque
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagem</CardTitle>
            </CardHeader>

            <CardContent>
              <ImageUploader
                value={image ? [image] : []}
                onChange={(images) => {
                  const newImage = images[0] || null;
                  setImage(newImage);

                  // Se tinha imagem original e agora não tem nenhuma, marca para remover
                  if (category.image?.asset?._ref && !newImage) {
                    setShouldRemoveImage(true);
                  }
                  // Se adiciona uma nova imagem (arquivo), desmarca a flag de remover
                  else if (newImage?.file) {
                    setShouldRemoveImage(false);
                  }
                  // Se remove a imagem nova mas tem imagem original, volta a marcar para remover
                  else if (!newImage && !category.image?.asset?._ref) {
                    setShouldRemoveImage(false);
                  }
                }}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
