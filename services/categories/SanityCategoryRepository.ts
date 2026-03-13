import type { Category } from "@/core/categories/Category";
import type { CategoryRepository } from "@/core/categories/CategoryRepository";
import type { PaginatedResult } from "@/core/types/Pagination";
import { writeClient } from "@/sanity/lib/writeClient";

type SanityCategory = Omit<Category, "slug"> & {
  _id: string;
  slug: {
    _type: "slug";
    current: string;
  };
};

type SanityCategoryUpdate = Partial<Omit<Category, "slug">> & {
  slug?: {
    _type: "slug";
    current: string;
  };
};

export class SanityCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories: SanityCategory[] = await writeClient.fetch(
      `*[_type == "category"] | order(_createdAt desc)`,
    );

    return categories.map((category) => ({
      ...category,
      slug: category.slug?.current ?? "",
    }));
  }

  async findPaginated(
    page: number,
    pageSize: number,
    query?: string,
  ): Promise<PaginatedResult<Category>> {
    const offset = (page - 1) * pageSize;
    const end = offset + pageSize;

    const searchFilter = query
      ? `&& (title match "*${query}*" || description match "*${query}*")`
      : "";

    const baseQuery = `*[_type == "category" ${searchFilter}]`;
    const countQuery = `count(${baseQuery})`;

    const [items, total] = await Promise.all([
      writeClient.fetch<SanityCategory[]>(
        `${baseQuery} | order(_createdAt desc) [$offset...$end]`,
        { offset, end },
      ),
      writeClient.fetch<number>(countQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: items.map((category) => ({
        ...category,
        slug: category.slug?.current ?? "",
      })),
      totalItems: total,
      totalPages,
      currentPage: page,
    };
  }

  async findById(id: string): Promise<Category | null> {
    const category: SanityCategory | null = await writeClient.fetch(
      `*[_type == "category" && _id == $id][0]`,
      { id },
    );

    if (!category) return null;

    return {
      ...category,
      slug: category.slug?.current ?? "",
    };
  }

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

  async update(id: string, category: Partial<Category>): Promise<void> {
    const { slug, ...rest } = category;

    const updateData: SanityCategoryUpdate = {
      ...rest,
      ...(slug && {
        slug: {
          _type: "slug",
          current: slug,
        },
      }),
    };

    // Remove a propriedade image do updateData se ela for undefined
    if (Object.hasOwn(category, "image") && category.image === undefined) {
      console.log(
        "[SanityCategoryRepository] Removendo imagem da categoria:",
        id,
      );
      delete updateData.image;
      await writeClient.patch(id).set(updateData).unset(["image"]).commit();
      console.log(
        "[SanityCategoryRepository] Imagem removida com sucesso:",
        id,
      );
    } else {
      console.log("[SanityCategoryRepository] Atualizando categoria:", {
        id,
        hasImage: !!category.image,
      });
      await writeClient.patch(id).set(updateData).commit();
    }
  }

  async delete(id: string): Promise<void> {
    await writeClient.delete(id);
  }
}
