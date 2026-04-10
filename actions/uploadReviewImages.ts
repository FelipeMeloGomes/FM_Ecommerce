import { writeClient } from "@/sanity/lib/writeClient";

export async function uploadReviewImages(files: File[]) {
  if (!files || files.length === 0) return [];

  const uploadedImages: Array<{
    _key: string;
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  }> = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const asset = await writeClient.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      });

      uploadedImages.push({
        _key: crypto.randomUUID(),
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Erro ao fazer upload da imagem. Tente novamente.");
    }
  }

  return uploadedImages;
}
