"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormError } from "@/components/FormError";
import { type ImagePreview, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  type CreateCategoryInput,
  createCategorySchema,
} from "@/schemas/createCategorySchema";

export default function AdminAddCategory() {
  const [image, setImage] = useState<ImagePreview | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      featured: false,
    },
  });

  const featured = watch("featured");

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, [image]);

  const onSubmit = async (data: CreateCategoryInput) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      await apiRequest<{ success: true }>("/api/admin/categories", {
        method: "POST",
        body: formData,
      });

      toast.success("Categoria criada com sucesso");

      reset();
      setImage(null);
    } catch {
      toast.error("Erro ao criar categoria");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Nova Categoria</h1>

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
                  <Checkbox
                    id="featured"
                    {...register("featured")}
                    checked={featured}
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
                onChange={(images) => setImage(images[0] || null)}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Criando..." : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
