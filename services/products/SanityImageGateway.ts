import type { ProductImage } from "@/core/products/Product";
import type { ProductImageGateway } from "@/core/products/ProductImageGateway";
import { writeClient } from "@/sanity/lib/writeClient";

export class SanityImageGateway implements ProductImageGateway {
  async uploadMany(files?: File[]): Promise<ProductImage[]> {
    if (!files || files.length === 0) return [];

    const uploadedImages: ProductImage[] = [];

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
}
