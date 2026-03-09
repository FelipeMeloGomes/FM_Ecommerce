import type { Category } from "./Category";

export interface CategoryRepository {
  findBySlug(slug: string): Promise<Category | null>;
  create(category: Category): Promise<void>;
}
