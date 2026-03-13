import type { PaginatedResult } from "../types/Pagination";
import type { Product } from "./Product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findPaginated(
    page: number,
    pageSize: number,
    query?: string,
  ): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  create(product: Product): Promise<void>;
  update(id: string, product: Partial<Product>): Promise<void>;
  delete(id: string): Promise<void>;
}
