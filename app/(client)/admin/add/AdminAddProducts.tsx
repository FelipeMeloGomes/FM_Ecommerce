"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { useImageCleanup } from "@/hooks/use-image-cleanup";
import { apiRequest } from "@/lib/api/apiRequest";
import {
  type CreateProductInput,
  createProductSchema,
} from "@/lib/schemas/createProductSchema";
import type { Brand, Category } from "@/sanity.types";

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function AdminAddProducts({ categories, brands }: Props) {
  const [images, setImages] = useState<ImageFile[]>([]);

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

  const lastImage =
    images.length > 0 ? images[images.length - 1].preview : null;
  useImageCleanup(lastImage);

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
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Novo Produto
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preencha os dados do produto
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
                    placeholder="Nome do produto"
                    {...register("name")}
                    className="h-11"
                  />
                  <FormError message={errors.name?.message} />
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Descrição"
                  {...register("description")}
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
                Adicione imagens do produto
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
                  placeholder="Preço"
                  {...register("price")}
                  className="h-11"
                />
                <FormError message={errors.price?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Desconto"
                  {...register("discount")}
                  className="h-11"
                />
                <FormError message={errors.discount?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Estoque"
                  {...register("stock")}
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
                  placeholder="Peso (kg)"
                  {...register("weight")}
                  className="h-11"
                />
                <FormError message={errors.weight?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Largura (cm)"
                  {...register("width")}
                  className="h-11"
                />
                <FormError message={errors.width?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Altura (cm)"
                  {...register("height")}
                  className="h-11"
                />
                <FormError message={errors.height?.message} />
              </div>

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Comprimento (cm)"
                  {...register("length")}
                  className="h-11"
                />
                <FormError message={errors.length?.message} />
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
                <Select onValueChange={(v) => setValue("status", v)}>
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
                <Select onValueChange={(v) => setValue("variant", v)}>
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
                <FormError message={errors.categories?.message} />
              </div>

              <div className="space-y-2">
                <Select
                  defaultValue={brands[0]?._id}
                  onValueChange={(v) => setValue("brand", v)}
                >
                  <SelectTrigger className="h-11">
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
              </div>

              <div className="flex items-center space-x-2">
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
            {isSubmitting ? "Criando..." : "Criar Produto"}
          </Button>
        </form>
      </div>
    </div>
  );
}
