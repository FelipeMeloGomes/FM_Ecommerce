"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Brand } from "@/core/brands/Brand";
import { apiRequest } from "@/lib/api/apiRequest";
import { urlFor } from "@/sanity/lib/image";

const brandSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface EditBrandFormProps {
  brand: Brand;
}

export default function EditBrandForm({ brand }: EditBrandFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<ImageFile | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      title: brand.title,
      description: brand.description,
    },
  });

  useEffect(() => {
    if (brand.image?.asset?._ref && !image && !shouldRemoveImage) {
      const previewUrl = urlFor(brand.image.asset._ref).url();
      if (previewUrl) {
        setImage({
          id: brand.image._key || crypto.randomUUID(),
          preview: previewUrl,
          file: undefined,
        });
      }
    }

    return () => {
      if (image?.preview && image?.file) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [brand.image, shouldRemoveImage, image]);

  const onSubmit = async (data: BrandFormData) => {
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
      await apiRequest<{ success: true }>(`/api/admin/brands/${brand._id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Marca atualizada com sucesso");
      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar marca";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Editar Marca
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Atualize os dados da marca
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
              onChange={(images) => {
                const newImage = images[0] || null;
                setImage(newImage);

                if (brand.image?.asset?._ref && !newImage) {
                  setShouldRemoveImage(true);
                } else if (newImage?.file) {
                  setShouldRemoveImage(false);
                } else if (!newImage && !brand.image?.asset?._ref) {
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
              onClick={() => router.push("/admin/brands")}
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
