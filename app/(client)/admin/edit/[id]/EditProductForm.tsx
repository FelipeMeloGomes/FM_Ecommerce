"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/FormError";
import { type ImageFile, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product, ProductImage } from "@/core/products/Product";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  type ProductFormInput,
  productSchema,
} from "@/lib/schemas/productFormInput";
import { urlFor } from "@/sanity/lib/image";
import type { Brand, Category } from "@/sanity.types";

interface Props {
  product: Product;
  categories: Category[];
  brands: Brand[];
}

export function EditProductForm({ product, categories, brands }: Props) {
  const router = useRouter();

  const [images, setImages] = useState<ImageFile[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",

      price: product.price,
      discount: product.discount,
      stock: product.stock ?? undefined,

      weight: product.weight,
      width: product.width,
      height: product.height,
      length: product.length,

      variant: product.variant ?? "",
      brand: product.brand?._ref ?? brands[0]?._id ?? "",
      categories: product.categories?.map((c) => c._ref) ?? [],

      status: product.status ?? "",
      isFeatured: product.isFeatured ?? false,
    },
  });

  const categoriesSelected = watch("categories");
  const isFeatured = watch("isFeatured");
  const variant = watch("variant");
  const brand = watch("brand");
  const status = watch("status");

  useEffect(() => {
    if (product.images?.length) {
      const existingImages: ImageFile[] = [];

      for (const img of product.images) {
        if (img.asset?._ref) {
          const previewUrl = urlFor(img.asset._ref).url();
          if (previewUrl) {
            existingImages.push({
              id: crypto.randomUUID(),
              preview: previewUrl,
              sanityRef: img,
            });
          }
        }
      }

      setImages(existingImages);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const onSubmit = async (data: ProductFormInput) => {
    const formData = new FormData();
    const retainedImages: ProductImage[] = [];

    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      } else if (image.sanityRef) {
        retainedImages.push(image.sanityRef as ProductImage);
      }
    });

    formData.append("retainedImages", JSON.stringify(retainedImages));

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          formData.append(key, v);
        });
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    try {
      await apiRequest(`/api/admin/products/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Produto atualizado com sucesso");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar produto",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Editar Produto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Atualize os dados do produto
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">
                Informações Básicas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Nome e descrição do produto
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    {...register("name")}
                    placeholder="Nome do produto"
                    className="h-11"
                  />
                  <FormError message={errors.name?.message} />
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  {...register("description")}
                  placeholder="Descrição"
                  className="min-h-[120px]"
                />
                <FormError message={errors.description?.message} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">Imagens</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie as imagens do produto
              </p>
            </div>

            <ImageUploader value={images} onChange={setImages} />
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">
                Preço & Estoque
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Valores e disponibilidade
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("price")}
                  placeholder="Preço"
                  className="h-11"
                />
                <FormError message={errors.price?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("discount")}
                  placeholder="Desconto"
                  className="h-11"
                />
                <FormError message={errors.discount?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("stock")}
                  placeholder="Estoque"
                  className="h-11"
                />
                <FormError message={errors.stock?.message} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">Dimensões</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Peso e dimensões para entrega
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("weight")}
                  placeholder="Peso (kg)"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("width")}
                  placeholder="Largura (cm)"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("height")}
                  placeholder="Altura (cm)"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  {...register("length")}
                  placeholder="Comprimento (cm)"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-sm space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-lg font-medium text-foreground">
                Organização
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Categorização e visibilidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={status}
                  onValueChange={(v) => setValue("status", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={variant}
                  onValueChange={(v) => setValue("variant", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Tipo do Produto" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="gadget">Gadget</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="refrigerators">Refrigerators</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <MultiSelect
                  options={categories}
                  value={categoriesSelected}
                  onChange={(v) => setValue("categories", v)}
                  placeholder="Selecione as categorias"
                />
              </div>

              <div className="space-y-2">
                <Select
                  value={brand}
                  onValueChange={(v) => setValue("brand", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>

                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b._id} value={b._id ?? ""}>
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(v) => setValue("isFeatured", Boolean(v))}
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm text-foreground cursor-pointer"
                >
                  Produto em destaque
                </label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-medium"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
