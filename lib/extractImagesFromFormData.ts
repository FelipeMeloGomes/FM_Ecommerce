import type { ProductImage } from "@/core/products/Product";

export function extractImagesFromFormData(formData: FormData): {
  existingImages: ProductImage[];
  newImageFiles: File[];
} {
  const existingImages: ProductImage[] = [];
  const newImageFiles: File[] = [];

  const retainedImagesRaw = formData.get("retainedImages");

  if (retainedImagesRaw) {
    try {
      const parsed = JSON.parse(retainedImagesRaw.toString());

      if (Array.isArray(parsed)) {
        existingImages.push(...parsed);
      }
    } catch (error) {
      console.error("Error parsing retained images", error);
    }
  }

  const imageFilesRaw = formData.getAll("images");

  for (const file of imageFilesRaw) {
    if (file instanceof File) {
      newImageFiles.push(file);
    }
  }

  return { existingImages, newImageFiles };
}
