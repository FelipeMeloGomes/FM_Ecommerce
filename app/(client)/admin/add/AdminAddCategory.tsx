"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  type CreateCategoryInput,
  createCategorySchema,
} from "@/lib/schemas/createCategorySchema";

export default function AdminAddCategory() {
  const [image, setImage] = useState<ImageFile | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      featured: false,
    },
  });

  const isFeatured = watch("featured");

  useEffect(() => {
    return () => {
      if (image?.preview && image?.file) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const onSubmit = async (data: CreateCategoryInput) => {
    const formData = new FormData();

    formData.append("title", String(data.title));

    if (data.description) {
      formData.append("description", String(data.description));
    }

    formData.append("range", String(data.range ?? 0));
    formData.append("featured", String(data.featured ?? false));

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
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar categoria";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Nova Categoria
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione uma nova categoria ao catálogo
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
              onChange={(images) => setImage(images[0] || null)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-medium"
          >
            {isSubmitting ? "Criando..." : "Criar Categoria"}
          </Button>
        </form>
      </div>
    </div>
  );
}
