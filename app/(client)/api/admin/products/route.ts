import { CreateProduct } from "@/core/products/CreateProduct";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import { productSchema } from "@/lib/schemas/productSchema";
import { SanityImageGateway } from "@/services/products/SanityImageGateway";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import { SlugService } from "@/services/products/SlugService";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const data = {
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      price: Number(formData.get("price")) || 0,
      discount: Number(formData.get("discount")) || 0,
      stock: Number(formData.get("stock")) || 0,
      weight: Number(formData.get("weight")) || 0,
      width: Number(formData.get("width")) || 0,
      height: Number(formData.get("height")) || 0,
      length: Number(formData.get("length")) || 0,
      status: formData.get("status")?.toString(),
      variant: formData.get("variant")?.toString(),
      isFeatured: formData.get("isFeatured") === "true",
      categories: formData.getAll("categories").map((catId) => String(catId)),
      brand: formData.get("brand")?.toString(),
      images: formData.getAll("images") as File[],
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const categories = (result.data.categories || []).map((catId) => ({
      _type: "reference" as const,
      _ref: catId,
      _key: crypto.randomUUID(),
    }));

    await new CreateProduct(
      new SanityProductRepository(),
      new SlugService(),
      new SanityImageGateway(),
    ).execute({
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      discount: result.data.discount,
      stock: result.data.stock,
      weight: result.data.weight,
      width: result.data.width,
      height: result.data.height,
      length: result.data.length,
      status: result.data.status,
      variant: result.data.variant,
      isFeatured: result.data.isFeatured,
      categories,
      brand: result.data.brand
        ? { _type: "reference" as const, _ref: result.data.brand }
        : undefined,
      imageFiles: result.data.images || [],
    });

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";
    console.error(error);
    return errorResponse(message, status);
  }
}
