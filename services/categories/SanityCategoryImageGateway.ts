import type { CategoryImage } from "@/core/categories/Category";
import type { CategoryImageGateway } from "@/core/categories/CategoryImageGateway";
import { writeClient } from "@/sanity/lib/writeClient";

export class SanityCategoryImageGateway implements CategoryImageGateway {
  async upload(file?: File): Promise<CategoryImage | undefined> {
    if (!file || file.size === 0) return undefined;

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
    });

    return {
      _key: crypto.randomUUID(),
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  }
}
