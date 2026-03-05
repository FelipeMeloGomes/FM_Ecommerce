import type { Product } from "./Product";
import type { ProductImageGateway } from "./ProductImageGateway";
import type { ProductRepository } from "./ProductRepository";
import type { SlugGateway } from "./SlugGateway";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  status?: string;
  variant?: string;
  isFeatured: boolean;
  categories: {
    _type: "reference";
    _ref: string;
  }[];
  brand?: {
    _type: "reference";
    _ref: string;
  };
  imageFiles?: File[];
}

export class CreateProduct {
  constructor(
    private repository: ProductRepository,
    private slugGateway: SlugGateway,
    private imageGateway: ProductImageGateway,
  ) {}

  async execute(input: CreateProductInput): Promise<void> {
    const slug = await this.slugGateway.generate(input.name);

    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw new Error("Slug já existe");
    }

    const images = await this.imageGateway.uploadMany(input.imageFiles);

    const product: Product = {
      name: input.name,
      slug,
      images,
      description: input.description,
      price: input.price,
      discount: input.discount,
      stock: input.stock,
      weight: input.weight,
      width: input.width,
      height: input.height,
      length: input.length,
      status: input.status,
      variant: input.variant,
      isFeatured: input.isFeatured,
      brand: input.brand,
      categories: input.categories,
    };

    await this.repository.create(product);
  }
}
