import { NextResponse } from "next/server";
import { DeleteProduct } from "@/core/products/DeleteProduct";
import { UpdateProduct } from "@/core/products/UpdateProduct";
import { extractImagesFromFormData } from "@/lib/extractImagesFromFormData";
import { requireAdmin } from "@/lib/requireAdmin";
import { SanityImageGateway } from "@/services/products/SanityImageGateway";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import { SlugService } from "@/services/products/SlugService";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await request.formData();

    const { existingImages, newImageFiles } =
      extractImagesFromFormData(formData);

    const useCase = new UpdateProduct(
      new SanityProductRepository(),
      new SanityImageGateway(),
    );

    await useCase.execute({
      id,
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
      isFeatured: formData.get("isFeatured") === "true",
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
      existingImages,
      newImageFiles,
      slugService: new SlugService(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Slug já existe") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const useCase = new DeleteProduct(new SanityProductRepository());
    await useCase.execute(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
