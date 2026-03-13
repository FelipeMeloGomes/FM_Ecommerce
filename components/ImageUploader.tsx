"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageFile {
  id: string;
  file?: File;
  preview: string;
  sanityRef?: unknown;
}

interface ImageUploaderProps {
  name?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  value?: ImageFile[];
  onChange?: (images: ImageFile[]) => void;
  className?: string;
}

export function ImageUploader({
  name,
  label,
  description,
  required = false,
  disabled = false,
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const isControlled = value !== undefined;
  const [internalImages, setInternalImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const images = isControlled ? value : internalImages;
  const setImages = useCallback(
    (newImages: ImageFile[] | ((prev: ImageFile[]) => ImageFile[])) => {
      if (isControlled) {
        const updated =
          typeof newImages === "function" ? newImages(images) : newImages;
        onChange?.(updated);
      } else {
        setInternalImages(newImages);
      }
    },
    [isControlled, onChange, images],
  );

  const generateId = useCallback(() => crypto.randomUUID(), []);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Formato não suportado. Use: ${acceptedFormats
          .map((f) => f.split("/")[1].toUpperCase())
          .join(", ")}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
      }
      return null;
    },
    [acceptedFormats, maxSizeMB],
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        setError("Apenas uma imagem permitida");
        return;
      }

      const remainingSlots = multiple ? maxFiles - images.length : 1;
      if (fileArray.length > remainingSlots) {
        setError(`Máximo de ${maxFiles} imagens permitido`);
        return;
      }

      const newImages: ImageFile[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }

        newImages.push({
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
        });
      }

      const updatedImages = multiple ? [...images, ...newImages] : newImages;
      setImages(updatedImages);
    },
    [images, multiple, maxFiles, validateFile, setImages, generateId],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [processFiles],
  );

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove?.file) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updatedImages = images.filter((img) => img.id !== id);
      setImages(updatedImages);
      setError(null);
    },
    [images, setImages],
  );

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      if (img.file) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
    setError(null);
  }, [images, setImages]);

  useEffect(() => {
    return () => {
      if (!isControlled) {
        images.forEach((img) => {
          if (img.file) {
            URL.revokeObjectURL(img.preview);
          }
        });
      }
    };
  }, [isControlled, images]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={acceptedFormats.join(",")}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 transition-all duration-200 w-full",
          disabled
            ? "cursor-not-allowed bg-muted/50 opacity-60"
            : "cursor-pointer",
          !disabled && isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : !disabled &&
                "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          images.length > 0 && "pb-4",
        )}
      >
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted",
          )}
        >
          <Upload
            className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-base font-medium text-foreground">
            {isDragging
              ? "Solte as imagens aqui"
              : "Arraste e solte suas imagens"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ou clique para selecionar
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {acceptedFormats
              .map((f) => f.split("/")[1].toUpperCase())
              .join(", ")}{" "}
            - Máx. {maxSizeMB}MB
            {multiple && ` - Até ${maxFiles} arquivos`}
          </p>
        </div>
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {images.length} {images.length === 1 ? "imagem" : "imagens"}{" "}
              selecionada
              {images.length > 1 ? "s" : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              Remover todas
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images
              .filter((img) => !!img?.preview && img.preview.trim() !== "")
              .map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image.preview}
                    alt={image.file?.name || "Image"}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {image.file && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs text-white">
                        {image.file.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}

            {multiple && images.length < maxFiles && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Adicionar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
