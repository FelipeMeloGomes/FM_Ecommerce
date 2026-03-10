import { NextResponse } from "next/server";
import { CreateProduct } from "@/core/products/CreateProduct";
import { requireAdmin } from "@/lib/requireAdmin";
import { SanityImageGateway } from "@/services/products/SanityImageGateway";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import { SlugService } from "@/services/products/SlugService";

function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    if (error.message === "Slug já existe") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
  console.error(error);
  return NextResponse.json(
    { message: "Erro interno do servidor" },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const imageFiles = formData.getAll("images") as File[];
    const useCase = new CreateProduct(
      new SanityProductRepository(),
      new SlugService(),
      new SanityImageGateway(),
    );
    await useCase.execute({
      name: String(formData.get("name")),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price")),
      discount: Number(formData.get("discount")),
      stock: Number(formData.get("stock") ?? 0),
      weight: Number(formData.get("weight")),
      width: Number(formData.get("width")),
      height: Number(formData.get("height")),
      length: Number(formData.get("length")),
      status: formData.get("status")?.toString(),
      variant: formData.get("variant")?.toString(),
      categories: formData.getAll("categories").map((id) => ({
        _type: "reference",
        _ref: String(id),
        _key: crypto.randomUUID(),
      })),
      brand: formData.get("brand")
        ? {
            _type: "reference",
            _ref: String(formData.get("brand")),
          }
        : undefined,
      isFeatured: formData.get("isFeatured") === "true",
      imageFiles,
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
