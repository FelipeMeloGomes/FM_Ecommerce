import type { Product } from "./Product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
  update(id: string, product: Partial<Product>): Promise<void>;
  delete(id: string): Promise<void>;
}
