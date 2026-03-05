import type { Product } from "@/core/products/Product";
import type { ProductRepository } from "@/core/products/ProductRepository";
import { writeClient } from "@/sanity/lib/writeClient";

type SanityProduct = Omit<Product, "slug"> & {
  slug: {
    _type: "slug";
    current: string;
  };
};

type SanityProductUpdate = Partial<Omit<Product, "slug">> & {
  slug?: {
    _type: "slug";
    current: string;
  };
};

export class SanityProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const products: SanityProduct[] = await writeClient.fetch(
      `*[_type == "product"] | order(_createdAt desc)`,
    );

    return products.map((product) => ({
      ...product,
      slug: product.slug?.current ?? "",
    }));
  }

  async findById(id: string): Promise<Product | null> {
    const product: SanityProduct | null = await writeClient.fetch(
      `*[_type == "product" && _id == $id][0]`,
      { id },
    );

    if (!product) return null;

    return {
      ...product,
      slug: product.slug?.current ?? "",
    };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product: SanityProduct | null = await writeClient.fetch(
      `*[_type == "product" && slug.current == $slug][0]`,
      { slug },
    );

    if (!product) return null;

    return {
      ...product,
      slug: product.slug?.current ?? "",
    };
  }

  async create(product: Product): Promise<void> {
    const { slug, ...rest } = product;

    await writeClient.create({
      _type: "product",
      ...rest,
      slug: {
        _type: "slug",
        current: slug,
      },
    });
  }

  async update(id: string, product: Partial<Product>): Promise<void> {
    const { slug, ...rest } = product;

    const updateData: SanityProductUpdate = {
      ...rest,
      ...(slug && {
        slug: {
          _type: "slug",
          current: slug,
        },
      }),
    };

    await writeClient.patch(id).set(updateData).commit();
  }

  async delete(id: string): Promise<void> {
    await writeClient.delete(id);
  }
}
