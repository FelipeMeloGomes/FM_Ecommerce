import type { Brand } from "@/core/brands/Brand";
import type { BrandRepository } from "@/core/brands/BrandRepository";
import type { PaginatedResult } from "@/core/types/Pagination";
import { writeClient } from "@/sanity/lib/writeClient";
import type { Slug } from "@/sanity.types";

type SanityBrand = {
  _id: string;
  _type: "brand";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  description?: string;
  image?: Brand["image"];
};

export class SanityBrandRepository implements BrandRepository {
  async findAll(): Promise<Brand[]> {
    const brands: SanityBrand[] = await writeClient.fetch(
      `*[_type == "brand"] | order(_createdAt desc)`,
    );

    return brands.map((brand) => ({
      _id: brand._id,
      title: brand.title ?? "",
      slug: brand.slug?.current ?? "",
      description: brand.description,
      image: brand.image,
    }));
  }

  async findPaginated(
    page: number,
    pageSize: number,
    query?: string,
  ): Promise<PaginatedResult<Brand>> {
    const offset = (page - 1) * pageSize;
    const end = offset + pageSize;

    const searchFilter = query
      ? `&& (title match "*${query}*" || description match "*${query}*")`
      : "";

    const baseQuery = `*[_type == "brand" ${searchFilter}]`;
    const countQuery = `count(${baseQuery})`;

    const [items, total] = await Promise.all([
      writeClient.fetch<SanityBrand[]>(
        `${baseQuery} | order(_createdAt desc) [$offset...$end]`,
        { offset, end },
      ),
      writeClient.fetch<number>(countQuery),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: items.map((brand) => ({
        _id: brand._id,
        title: brand.title ?? "",
        slug: brand.slug?.current ?? "",
        description: brand.description,
        image: brand.image,
      })),
      totalItems: total,
      totalPages,
      currentPage: page,
    };
  }

  async findById(id: string): Promise<Brand | null> {
    const brand: SanityBrand | null = await writeClient.fetch(
      `*[_type == "brand" && _id == $id][0]`,
      { id },
    );

    if (!brand) return null;

    return {
      _id: brand._id,
      title: brand.title ?? "",
      slug: brand.slug?.current ?? "",
      description: brand.description,
      image: brand.image,
    };
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    const brand: SanityBrand | null = await writeClient.fetch(
      `*[_type == "brand" && slug.current == $slug][0]`,
      { slug },
    );

    if (!brand) return null;

    return {
      _id: brand._id,
      title: brand.title ?? "",
      slug: brand.slug?.current ?? "",
      description: brand.description,
      image: brand.image,
    };
  }

  async create(brand: Brand): Promise<void> {
    const { slug, ...rest } = brand;

    await writeClient.create({
      _type: "brand",
      ...rest,
      slug: {
        _type: "slug",
        current: slug,
      },
    });
  }

  async update(id: string, brand: Partial<Brand>): Promise<void> {
    const { slug, image, ...rest } = brand;

    const updateData: Record<string, unknown> = {
      ...rest,
      ...(slug && {
        slug: {
          _type: "slug",
          current: slug,
        },
      }),
    };

    if (Object.hasOwn(brand, "image") && brand.image === undefined) {
      console.log("[SanityBrandRepository] Removendo imagem da marca:", id);
      await writeClient.patch(id).set(updateData).unset(["image"]).commit();
    } else if (image) {
      updateData.image = image;
      await writeClient.patch(id).set(updateData).commit();
    } else {
      await writeClient.patch(id).set(updateData).commit();
    }
  }

  async delete(id: string): Promise<void> {
    await writeClient.delete(id);
  }
}
