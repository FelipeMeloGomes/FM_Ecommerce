import type { Product } from "./Product";

export interface ProductRepository {
  findBySlug(slug: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
}
