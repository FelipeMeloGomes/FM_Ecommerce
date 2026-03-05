"use client";

import { X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Input } from "@/components/ui/input";
import type { ProductImage } from "@/core/products/Product";

export interface ImagePreview {
  id: string;
  file?: File;
  previewUrl: string;
  sanityRef?: ProductImage;
}
interface ImageUploaderProps {
  value: ImagePreview[];
  onChange: (images: ImagePreview[]) => void;
  multiple?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  multiple = true,
}: ImageUploaderProps) {
  /**
   * Cleanup apenas dos object URLs criados
   * Quando o componente desmontar
   */
  React.useEffect(() => {
    return () => {
      value.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [value]);

  const handleImageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const files = Array.from(event.target.files);

      const newImages: ImagePreview[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      onChange([...value, ...newImages]);

      event.target.value = "";
    },
    [value, onChange],
  );

  const removeImage = React.useCallback(
    (id: string) => {
      const image = value.find((img) => img.id === id);

      if (image?.file) {
        URL.revokeObjectURL(image.previewUrl);
      }

      onChange(value.filter((img) => img.id !== id));
    },
    [value, onChange],
  );

  return (
    <div className="space-y-4">
      <Input
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleImageChange}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((image) => (
            <div
              key={image.id}
              className="relative rounded-xl overflow-hidden border"
            >
              <Image
                src={image.previewUrl}
                alt="Preview"
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
    </div>
  );
}
