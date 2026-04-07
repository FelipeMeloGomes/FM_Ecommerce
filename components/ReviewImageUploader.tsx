"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface ReviewImage {
  id: string;
  file?: File;
  preview: string;
  isExisting?: boolean;
}

interface ReviewImageUploaderProps {
  images: ReviewImage[];
  onChange: (images: ReviewImage[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export function ReviewImageUploader({
  images,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
}: ReviewImageUploaderProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  const acceptedFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const fileArray = Array.from(files);

    if (images.length + fileArray.length > maxFiles) {
      setError(`Máximo de ${maxFiles} imagens`);
      return;
    }

    const newImages: ReviewImage[] = [];
    for (const file of fileArray) {
      if (!acceptedFormats.includes(file.type)) {
        setError("Formato não suportado");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
        return;
      }

      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    onChange([...images, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove && !imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onChange(images.filter((img) => img.id !== id));
    setError(null);
  };

  return (
    <div className="space-y-2">
      <input
        id={inputId}
        type="file"
        accept={acceptedFormats.join(",")}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <label htmlFor={inputId} className="text-sm font-medium">
        Fotos do produto (opcional)
      </label>
      <p className="text-xs text-muted-foreground">
        Até {maxFiles} imagens - máx {maxSizeMB}MB cada
      </p>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative w-16 h-16 rounded-lg overflow-hidden border"
            >
              <Image
                src={image.preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxFiles && (
        <label
          htmlFor={inputId}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer text-sm text-muted-foreground hover:bg-muted/50 transition-colors",
          )}
        >
          <ImagePlus className="h-4 w-4" />
          Adicionar foto
        </label>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
