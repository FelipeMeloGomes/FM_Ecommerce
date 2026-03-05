"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

interface Props {
  product: Product;
  categories: Category[];
  brands: Brand[];
}

export function EditProductForm({ product, categories, brands }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isFeatured, setIsFeatured] = useState<boolean>(product.isFeatured);
  const [status, setStatus] = useState<string>(product.status || "");
  const [variant, setVariant] = useState<string>(product.variant || "");
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    product.categories?.map((c) => c._ref) || [],
  );
  const [brand, setBrand] = useState<string>(
    product.brand?._ref || brands[0]?._id || "",
  );

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
        if (img.file) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const retainedImages: ProductImage[] = [];

    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      } else if (image.sanityRef) {
        retainedImages.push(image.sanityRef);
      }
    });

    formData.append("retainedImages", JSON.stringify(retainedImages));
    formData.set("isFeatured", String(isFeatured));
    formData.set("status", status);
    formData.set("variant", variant);
    formData.delete("categories");
    categoriesSelected.forEach((cat) => {
      formData.append("categories", cat);
    });
    formData.set("brand", brand);

    try {
      await apiRequest<{ success: true }>(
        `/api/admin/products/${product._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      toast.success("Produto atualizado com sucesso!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar produto",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Editar Produto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Nome do produto"
                defaultValue={product.name}
                required
              />
              <Textarea
                name="description"
                placeholder="Descrição"
                className="md:col-span-2"
                defaultValue={product.description}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader value={images} onChange={setImages} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preço & Estoque</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Input
                name="price"
                type="number"
                step="0.01"
                placeholder="Preço"
                defaultValue={product.price}
                required
              />
              <Input
                name="discount"
                type="number"
                placeholder="Desconto %"
                defaultValue={product.discount}
                required
              />
              <Input
                name="stock"
                type="number"
                placeholder="Estoque"
                defaultValue={product.stock}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dimensões</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <Input
                name="weight"
                type="number"
                step="0.01"
                placeholder="Peso (kg)"
                defaultValue={product.weight}
                required
              />
              <Input
                name="width"
                type="number"
                placeholder="Largura (cm)"
                defaultValue={product.width}
                required
              />
              <Input
                name="height"
                type="number"
                placeholder="Altura (cm)"
                defaultValue={product.height}
                required
              />
              <Input
                name="length"
                type="number"
                placeholder="Comprimento (cm)"
                defaultValue={product.length}
                required
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select value={variant} onValueChange={setVariant}>
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
                onChange={setCategoriesSelected}
                placeholder="Categorias"
              />

              <Select value={brand} onValueChange={setBrand}>
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
                  onCheckedChange={(checked) => setIsFeatured(Boolean(checked))}
                />
                <label htmlFor="isFeatured" className="text-sm">
                  Produto em destaque
                </label>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
