import type { SlugGateway } from "@/core/products/SlugGateway";
import type { Brand } from "./Brand";
import type { BrandImageGateway } from "./BrandImageGateway";
import type { BrandRepository } from "./BrandRepository";

export interface CreateBrandInput {
  title: string;
  description?: string;
  imageFile?: File;
}

export class CreateBrand {
  constructor(
    private repository: BrandRepository,
    private slugGateway: SlugGateway,
    private imageGateway: BrandImageGateway,
  ) {}

  async execute(input: CreateBrandInput): Promise<void> {
    const slug = await this.slugGateway.generate(input.title);

    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw new Error("Slug já existe");
    }

    const image = await this.imageGateway.upload(input.imageFile);

    const brand: Brand = {
      title: input.title,
      slug,
      description: input.description,
      image,
    };

    await this.repository.create(brand);
  }
}
