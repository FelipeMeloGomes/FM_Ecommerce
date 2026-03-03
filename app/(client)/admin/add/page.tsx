"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductImagePreview {
  id: string;
  file: File;
  previewUrl: string;
}

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ProductImagePreview[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("");
  const [variant, setVariant] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const selectedFiles = Array.from(event.target.files);

      const newImages: ProductImagePreview[] = selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImages]);

      event.target.value = "";
    },
    [],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const resetForm = (form: HTMLFormElement, clearImages: () => void) => {
    form.reset();
    clearImages();
    setIsFeatured(false);
    setStatus("");
    setVariant("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    formData.set("isFeatured", String(isFeatured));
    formData.set("status", status);
    formData.set("variant", variant);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erro ao criar produto");
      }

      resetForm(form, () => {
        images.forEach((img) => {
          URL.revokeObjectURL(img.previewUrl);
        });

        setImages([]);
      });

      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar produto");
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
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative rounded-xl overflow-hidden border"
                    >
                      <Image
                        src={image.previewUrl}
                        alt="Preview da imagem"
                        width={300}
                        height={300}
                        className="object-cover w-full h-40"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

              <Select onValueChange={setVariant}>
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
