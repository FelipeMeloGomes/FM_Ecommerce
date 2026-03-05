import type { SlugService } from "@/services/products/SlugService";
import type { Product, ProductImage } from "./Product";
import type { ProductImageGateway } from "./ProductImageGateway";
import type { ProductRepository } from "./ProductRepository";

interface UpdateProductInput {
  id: string;
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
    _key: string;
  }[];
  brand?: {
    _type: "reference";
    _ref: string;
  };
  existingImages: ProductImage[];
  newImageFiles: File[];
  slugService: SlugService;
}

export class UpdateProduct {
  constructor(
    private repository: ProductRepository,
    private imageGateway: ProductImageGateway,
  ) {}

  async execute(input: UpdateProductInput): Promise<void> {
    const existingProduct = await this.repository.findById(input.id);
    if (!existingProduct) {
      throw new Error("Produto não encontrado");
    }

    let slug = existingProduct.slug;

    const nameChanged = input.name.trim() !== existingProduct.name.trim();

    if (nameChanged) {
      slug = await input.slugService.generate(input.name);

      const productWithSameSlug = await this.repository.findBySlug(slug);

      if (productWithSameSlug && productWithSameSlug._id !== input.id) {
        throw new Error("Slug já existe");
      }
    }

    const newImages = await this.imageGateway.uploadMany(input.newImageFiles);

    const allImages = [...input.existingImages, ...newImages];

    const updatedProductData: Partial<Product> = {
      name: input.name,
      slug,
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
      categories: input.categories,
      brand: input.brand,
      images: allImages,
    };

    await this.repository.update(input.id, updatedProductData);
  }
}
