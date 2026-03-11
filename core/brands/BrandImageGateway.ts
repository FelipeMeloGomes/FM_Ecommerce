import type { BrandImage } from "./Brand";

export interface BrandImageGateway {
  upload(file?: File): Promise<BrandImage | undefined>;
}
