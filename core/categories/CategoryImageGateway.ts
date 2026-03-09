import type { CategoryImage } from "./Category";

export interface CategoryImageGateway {
  upload(file?: File): Promise<CategoryImage | undefined>;
}
