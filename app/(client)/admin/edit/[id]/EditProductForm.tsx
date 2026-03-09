"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormError } from "@/components/FormError";
import { type ImagePreview, ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { urlFor } from "@/sanity/lib/image";
import type { Brand, Category } from "@/sanity.types";
import {
  type ProductFormInput,
  productSchema,
} from "@/schemas/productFormInput";

interface Props {
  product: Product;
  categories: Category[];
  brands: Brand[];
}

export function EditProductForm({ product, categories, brands }: Props) {
  const router = useRouter();

  const [images, setImages] = useState<ImagePreview[]>([]);

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
      const existingImages: ImagePreview[] = product.images
        .filter((img) => img.asset?._ref)
        .map((img) => ({
          id: crypto.randomUUID(),
          previewUrl: urlFor(img.asset._ref).url(),
          sanityRef: img,
        }));

      setImages(existingImages);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.previewUrl);
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
        retainedImages.push(image.sanityRef);
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
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Editar Produto</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Input {...register("name")} placeholder="Nome do produto" />
                <FormError message={errors.name?.message} />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("description")}
                  placeholder="Descrição"
                />
                <FormError message={errors.description?.message} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>

            <CardContent>
              <ImageUploader value={images} onChange={setImages} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preço & Estoque</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Input type="number" {...register("price")} />
                <FormError message={errors.price?.message} />
              </div>

              <div>
                <Input type="number" {...register("discount")} />
                <FormError message={errors.discount?.message} />
              </div>

              <div>
                <Input type="number" {...register("stock")} />
                <FormError message={errors.stock?.message} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensões</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-4 gap-4">
              <Input type="number" {...register("weight")} />
              <Input type="number" {...register("width")} />
              <Input type="number" {...register("height")} />
              <Input type="number" {...register("length")} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <Select
                value={status}
                onValueChange={(v) => setValue("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={variant}
                onValueChange={(v) => setValue("variant", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gadget">Gadget</SelectItem>
                  <SelectItem value="appliances">Appliances</SelectItem>
                  <SelectItem value="refrigerators">Refrigerators</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>

              <MultiSelect
                options={categories}
                value={categoriesSelected}
                onChange={(v) => setValue("categories", v)}
                placeholder="Categorias"
              />

              <Select value={brand} onValueChange={(v) => setValue("brand", v)}>
                <SelectTrigger>
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

              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(v) => setValue("isFeatured", Boolean(v))}
                />

                <label htmlFor="isFeatured" className="text-sm">
                  Produto em destaque
                </label>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
