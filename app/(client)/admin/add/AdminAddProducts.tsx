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
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api/apiRequest";
import type { Brand, Category } from "@/sanity.types";
import {
  type CreateProductInput,
  createProductSchema,
} from "@/schemas/createProductSchema";

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function AdminAddProducts({ categories, brands }: Props) {
  const [images, setImages] = useState<ImagePreview[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categories: [],
      brand: brands[0]?._id ?? "",
      variant: "",
      status: "",
      isFeatured: false,
    },
  });

  const categoriesSelected = watch("categories");
  const isFeatured = watch("isFeatured");

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const onSubmit = async (data: CreateProductInput) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          formData.append(key, v);
        });
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    try {
      await apiRequest<{ success: true }>("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      toast.success("Produto criado com sucesso");

      reset();
      setImages([]);
    } catch {
      toast.error("Erro ao criar produto");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Novo Produto</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Input placeholder="Nome do produto" {...register("name")} />
                <FormError message={errors.name?.message} />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  placeholder="Descrição"
                  {...register("description")}
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
                <Input
                  type="number"
                  placeholder="Preço"
                  {...register("price")}
                />
                <FormError message={errors.price?.message} />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Desconto"
                  {...register("discount")}
                />
                <FormError message={errors.discount?.message} />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Estoque"
                  {...register("stock")}
                />
                <FormError message={errors.stock?.message} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dimensões</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-4 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Peso"
                  {...register("weight")}
                />
                <FormError message={errors.weight?.message} />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Largura"
                  {...register("width")}
                />
                <FormError message={errors.width?.message} />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Altura"
                  {...register("height")}
                />
                <FormError message={errors.height?.message} />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Comprimento"
                  {...register("length")}
                />
                <FormError message={errors.length?.message} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <Select onValueChange={(v) => setValue("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => setValue("variant", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo do Produto" />
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

              <Select
                defaultValue={brands[0]?._id}
                onValueChange={(v) => setValue("brand", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>

                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id ?? ""}>
                      {brand.title}
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

              <FormError message={errors.categories?.message} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full h-12">
            {isSubmitting ? "Criando..." : "Criar Produto"}
          </Button>
        </form>
      </div>
    </div>
  );
}
