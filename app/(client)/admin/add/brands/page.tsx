"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/apiRequest";

const brandSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

export default function AdminAddBrand() {
  const [image, setImage] = useState<ImageFile | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
  });

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const onSubmit = async (data: BrandFormData) => {
    const formData = new FormData();

    formData.append("title", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      await apiRequest<{ success: true }>("/api/admin/brands", {
        method: "POST",
        body: formData,
      });

      toast.success("Marca criada com sucesso");

      reset();
      setImage(null);
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar marca";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Nova Marca
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Adicione uma nova marca ao catálogo
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">
                Informações Básicas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Nome e descrição da marca
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Título da marca"
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
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">Imagem</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione o logo da marca
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
            {isSubmitting ? "Criando..." : "Criar Marca"}
          </Button>
        </form>
      </div>
    </div>
  );
}
