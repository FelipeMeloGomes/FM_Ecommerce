import type { PaginatedResult } from "../types/Pagination";
import type { Brand } from "./Brand";

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findPaginated(
    page: number,
    pageSize: number,
    query?: string,
  ): Promise<PaginatedResult<Brand>>;
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  create(brand: Brand): Promise<void>;
  update(id: string, brand: Partial<Brand>): Promise<void>;
  delete(id: string): Promise<void>;
}
