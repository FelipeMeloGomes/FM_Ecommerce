import type { Product } from "@/core/products/Product";
import type { ProductRepository } from "@/core/products/ProductRepository";
import { writeClient } from "@/sanity/lib/writeClient";

export class SanityProductRepository implements ProductRepository {
  async findBySlug(slug: string): Promise<Product | null> {
    return writeClient.fetch(
      `*[_type == "product" && slug.current == $slug][0]`,
      { slug },
    );
  }

  async create(product: Product): Promise<void> {
    await writeClient.create({
      _type: "product",
      ...product,
      slug: {
        _type: "slug",
        current: product.slug,
      },
    });
  }
}
