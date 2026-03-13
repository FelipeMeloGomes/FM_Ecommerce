import type { SlugGateway } from "@/core/products/SlugGateway";
import type { Category } from "./Category";
import type { CategoryImageGateway } from "./CategoryImageGateway";
import type { CategoryRepository } from "./CategoryRepository";

export interface UpdateCategoryInput {
  title: string;
  description?: string;
  range?: number;
  featured?: boolean;
  image?: File;
  removeImage?: boolean;
}

export class UpdateCategory {
  constructor(
    private repository: CategoryRepository,
    private slugGateway: SlugGateway,
    private imageGateway: CategoryImageGateway,
  ) {}

  async execute(id: string, input: UpdateCategoryInput): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error("Categoria não encontrada");
    }

    console.log("[UpdateCategory] Processando update:", {
      id,
      removeImage: input.removeImage,
      hasImage: !!input.image,
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
      console.log("[UpdateCategory] Removendo imagem da categoria:", id);
      image = undefined;
    } else if (input.image) {
      console.log("[UpdateCategory] Fazendo upload de nova imagem para:", id);
      image = await this.imageGateway.upload(input.image);
    }

    const category: Category = {
      title: input.title,
      slug,
      description: input.description,
      range: input.range,
      featured: input.featured ?? false,
      image,
    };

    console.log("[UpdateCategory] Salvando categoria:", {
      id,
      hasImage: !!image,
    });

    await this.repository.update(id, category);
  }
}
