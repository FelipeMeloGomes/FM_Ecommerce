import type { SlugGateway } from "@/core/products/SlugGateway";
import type { Brand } from "./Brand";
import type { BrandImageGateway } from "./BrandImageGateway";
import type { BrandRepository } from "./BrandRepository";

export interface UpdateBrandInput {
  title: string;
  description?: string;
  imageFile?: File;
  removeImage?: boolean;
}

export class UpdateBrand {
  constructor(
    private repository: BrandRepository,
    private slugGateway: SlugGateway,
    private imageGateway: BrandImageGateway,
  ) {}

  async execute(id: string, input: UpdateBrandInput): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error("Marca não encontrada");
    }

    console.log("[UpdateBrand] Processando update:", {
      id,
      removeImage: input.removeImage,
      hasImageFile: !!input.imageFile,
      currentImage: !!existing.image,
    });

    let slug = existing.slug;

    if (input.title !== existing.title) {
      slug = await this.slugGateway.generate(input.title);

      const conflicting = await this.repository.findBySlug(slug);
      if (conflicting && conflicting._id !== id) {
        throw new Error("Slug já existe");
      }
    }

    let image = existing.image;

    if (input.removeImage) {
      console.log("[UpdateBrand] Removendo imagem da marca:", id);
      image = undefined;
    } else if (input.imageFile) {
      console.log("[UpdateBrand] Fazendo upload de nova imagem para:", id);
      image = await this.imageGateway.upload(input.imageFile);
    }

    const brand: Brand = {
      title: input.title,
      slug,
      description: input.description,
      image,
    };

    console.log("[UpdateBrand] Salvando marca:", {
      id,
      hasImage: !!image,
    });

    await this.repository.update(id, brand);
  }
}
