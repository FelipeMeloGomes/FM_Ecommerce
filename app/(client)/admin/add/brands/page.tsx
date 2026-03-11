"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FormError } from "@/components/FormError";
import { type ImagePreview, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/apiRequest";

const brandSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

export default function AdminAddBrand() {
  const [image, setImage] = useState<ImagePreview | null>(null);

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
        URL.revokeObjectURL(image.previewUrl);
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
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Nova Marca</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Input placeholder="Título da marca" {...register("title")} />
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
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Criando..." : "Criar Marca"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
