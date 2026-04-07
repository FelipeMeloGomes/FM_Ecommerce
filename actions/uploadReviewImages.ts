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

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
    });

    uploadedImages.push({
      _key: crypto.randomUUID(),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    });
  }

  return uploadedImages;
}
