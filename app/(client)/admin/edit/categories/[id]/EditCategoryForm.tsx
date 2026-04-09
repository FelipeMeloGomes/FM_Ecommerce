"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/core/categories/Category";
import { useImageCleanup } from "@/hooks/use-image-cleanup";
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
    setValue,
    watch,
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

  const isFeatured = watch("featured");

  useEffect(() => {
    if (category.image?.asset?._ref && !image && !shouldRemoveImage) {
      const previewUrl = urlFor(category.image.asset._ref).url();
      if (previewUrl) {
        setImage({
          id: category.image._key || crypto.randomUUID(),
          preview: previewUrl,
          file: undefined,
        });
      }
    }
  }, [category.image, shouldRemoveImage, image]);

  useImageCleanup(image?.file ? image.preview : null);

  const handleCancel = useCallback(() => {
    router.push("/admin/categories");
  }, [router]);

  const onSubmit = async (data: CreateCategoryInput) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (shouldRemoveImage) {
      formData.append("_removeImage", "true");
    }

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
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Editar Categoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Atualize os dados da categoria
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">
                Informações Básicas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Nome e descrição da categoria
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Título da categoria"
                  {...register("title")}
                  className="h-11"
                />
                <FormError message={errors.title?.message} />
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Descrição (opcional)"
                  {...register("description")}
                  rows={4}
                  className="min-h-[100px]"
                />
                <FormError message={errors.description?.message} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Faixa de preço (opcional)"
                    {...register("range")}
                    className="h-11"
                  />
                  <FormError message={errors.range?.message} />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(v) =>
                      setValue("featured", Boolean(v), { shouldValidate: true })
                    }
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    Categoria em destaque
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">Imagem</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione uma imagem representativa
              </p>
            </div>

            <ImageUploader
              value={image ? [image] : []}
              onChange={(images) => {
                const newImage = images[0] || null;
                setImage(newImage);

                if (category.image?.asset?._ref && !newImage) {
                  setShouldRemoveImage(true);
                } else if (newImage?.file) {
                  setShouldRemoveImage(false);
                } else if (!newImage && !category.image?.asset?._ref) {
                  setShouldRemoveImage(false);
                }
              }}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 text-base font-medium"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-12"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
