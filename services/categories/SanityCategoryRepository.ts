import type { Category } from "@/core/categories/Category";
import type { CategoryRepository } from "@/core/categories/CategoryRepository";
import { writeClient } from "@/sanity/lib/writeClient";

type SanityCategory = Omit<Category, "slug"> & {
  slug: {
    _type: "slug";
    current: string;
  };
};

export class SanityCategoryRepository implements CategoryRepository {
  async findBySlug(slug: string): Promise<Category | null> {
    const category: SanityCategory | null = await writeClient.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug },
    );

    if (!category) return null;

    return {
      ...category,
      slug: category.slug?.current ?? "",
    };
  }

  async create(category: Category): Promise<void> {
    const { slug, ...rest } = category;

    await writeClient.create({
      _type: "category",
      ...rest,
      slug: {
        _type: "slug",
        current: slug,
      },
    });
  }
}
