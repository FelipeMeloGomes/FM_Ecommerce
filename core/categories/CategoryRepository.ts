import type { PaginatedResult } from "../types/Pagination";
import type { Category } from "./Category";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findPaginated(
    page: number,
    pageSize: number,
    query?: string,
  ): Promise<PaginatedResult<Category>>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(category: Category): Promise<void>;
  update(id: string, category: Partial<Category>): Promise<void>;
  delete(id: string): Promise<void>;
}
