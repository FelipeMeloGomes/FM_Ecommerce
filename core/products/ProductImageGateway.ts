import type { ProductImage } from "./Product";

export interface ProductImageGateway {
  uploadMany(files?: File[]): Promise<ProductImage[]>;
}
