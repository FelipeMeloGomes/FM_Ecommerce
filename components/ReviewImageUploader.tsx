"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useId, useState } from "react";
import { useImageCleanup } from "@/hooks/use-image-cleanup";
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
  maxSizeMB = 10,
}: ReviewImageUploaderProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  const lastImageUrl =
    images.length > 0 ? images[images.length - 1].preview : null;
  useImageCleanup(lastImageUrl);

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
    let formatError = false;

    for (const file of fileArray) {
      if (!acceptedFormats.includes(file.type)) {
        setError("Formato não suportado. Use JPG, PNG, GIF ou WebP");
        formatError = true;
        break;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
        formatError = true;
        break;
      }

      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (!formatError) {
      onChange([...images, ...newImages]);
      e.target.value = "";
    }
  };

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      onChange(images.filter((img) => img.id !== id));
      setError(null);
    },
    [images, onChange],
  );

  const removeImageWrapper = useCallback(
    (id: string) => () => removeImage(id),
    [removeImage],
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <input
        id={inputId}
        type="file"
        accept={acceptedFormats.join(",")}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <label htmlFor={inputId} className="text-sm font-medium">
            Fotos do produto
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Até {maxFiles} imagens • máx {maxSizeMB}MB cada
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {images.length}/{maxFiles}
        </span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted/30 hover:border-shop_orange/50 transition-all duration-200"
            >
              <Image
                src={image.preview}
                alt="Preview da imagem"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <button
                type="button"
                onClick={removeImageWrapper(image.id)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              {image.file && (
                <span className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
                  {formatFileSize(image.file.size)}
                </span>
              )}
              {image.isExisting && (
                <span className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-shop_orange/60 px-1.5 py-0.5 rounded">
                  Existente
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < maxFiles && (
        <label
          htmlFor={inputId}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            "bg-muted/20 hover:bg-muted/40 hover:border-shop_orange/30",
            "text-muted-foreground hover:text-foreground",
          )}
        >
          <div className="p-3 rounded-full bg-muted">
            <ImagePlus className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Adicionar foto</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPG, PNG, GIF ou WebP
            </p>
          </div>
        </label>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
