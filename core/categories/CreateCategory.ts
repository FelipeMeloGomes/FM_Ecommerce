import type { SlugGateway } from "@/core/products/SlugGateway";
import type { Category } from "./Category";
import type { CategoryImageGateway } from "./CategoryImageGateway";
import type { CategoryRepository } from "./CategoryRepository";

export interface CreateCategoryInput {
  title: string;
  description?: string;
  range?: number;
  featured?: boolean;
  imageFile?: File;
}

export class CreateCategory {
  constructor(
    private repository: CategoryRepository,
    private slugGateway: SlugGateway,
    private imageGateway: CategoryImageGateway,
  ) {}

  async execute(input: CreateCategoryInput): Promise<void> {
    const slug = await this.slugGateway.generate(input.title);

    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw new Error("Slug já existe");
    }

    const image = await this.imageGateway.upload(input.imageFile);

    const category: Category = {
      title: input.title,
      slug,
      description: input.description,
      range: input.range,
      featured: input.featured ?? false,
      image,
    };

    await this.repository.create(category);
  }
}
