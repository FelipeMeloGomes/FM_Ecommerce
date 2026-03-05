"use client";

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
import { apiRequest } from "@/lib/api/apiRequest";
import type { Brand, Category } from "@/sanity.types";

interface Props {
  categories: Category[];
  brands: Brand[];
}

export default function AdminAddProducts({ categories, brands }: Props) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [brand, setBrand] = useState(brands[0]?._id ?? "");

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const resetForm = (form: HTMLFormElement, clearImages: () => void) => {
    form.reset();
    clearImages();
    setIsFeatured(false);
    setStatus("");
    setProductType("");
    setBrand("");
    setCategoriesSelected([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });

    formData.set("isFeatured", String(isFeatured));
    formData.set("status", status);
    formData.set("variant", productType);
    formData.delete("categories");

    categoriesSelected.forEach((cat) => {
      formData.append("categories", cat);
    });
    formData.set("brand", brand);

    try {
      await apiRequest<{ success: true }>("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      resetForm(form, () => {
        images.forEach((img) => {
          URL.revokeObjectURL(img.previewUrl);
        });

        setImages([]);
      });

      toast.success("Produto criado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Novo Produto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Input name="name" placeholder="Nome do produto" required />
              <Textarea
                name="description"
                placeholder="Descrição"
                className="md:col-span-2"
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
                required
              />
              <Input
                name="discount"
                type="number"
                placeholder="Desconto %"
                required
              />
              <Input name="stock" type="number" placeholder="Estoque" />
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
                required
              />
              <Input
                name="width"
                type="number"
                placeholder="Largura (cm)"
                required
              />
              <Input
                name="height"
                type="number"
                placeholder="Altura (cm)"
                required
              />
              <Input
                name="length"
                type="number"
                placeholder="Comprimento (cm)"
                required
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <Select onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select value={productType} onValueChange={setProductType}>
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
                onChange={setCategoriesSelected}
                placeholder="Categorias"
              />

              <Select value={brand} onValueChange={setBrand}>
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
            {loading ? "Criando..." : "Criar Produto"}
          </Button>
        </form>
      </div>
    </div>
  );
}
