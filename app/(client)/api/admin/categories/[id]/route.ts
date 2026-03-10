import { NextResponse } from "next/server";
import { DeleteCategory, UpdateCategory } from "@/core/categories";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  SanityCategoryImageGateway,
  SanityCategoryRepository,
} from "@/services/categories";
import { SlugService } from "@/services/products/SlugService";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const featured = formData.get("featured");
    const removeImage = formData.get("_removeImage") === "true";
    const featuredBoolean =
      featured !== null &&
      (featured === "true" || featured === "on" || featured === "1");

    console.log("[PUT /api/admin/categories/[id]]", {
      categoryId: id,
      hasImage: !!imageFile && imageFile.size > 0,
      removeImage,
      featured: featuredBoolean,
      title: formData.get("title"),
    });

    const useCase = new UpdateCategory(
      new SanityCategoryRepository(),
      new SlugService(),
      new SanityCategoryImageGateway(),
    );

    await useCase.execute(id, {
      title: String(formData.get("title") ?? ""),
      description: formData.get("description")?.toString(),
      range: formData.get("range") ? Number(formData.get("range")) : undefined,
      featured: featuredBoolean,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
      removeImage,
    });

    console.log("[PUT /api/admin/categories/[id]] Sucesso:", { id });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Desconhecido";
    console.error("Erro ao atualizar categoria:", errorMessage, error);

    if (errorMessage === "Slug já existe") {
      return NextResponse.json({ message: "Slug já existe" }, { status: 400 });
    }

    if (errorMessage === "Categoria não encontrada") {
      return NextResponse.json(
        { message: "Categoria não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Erro ao atualizar categoria: ${errorMessage}` },
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

    const useCase = new DeleteCategory(new SanityCategoryRepository());

    await useCase.execute(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Desconhecido";
    console.error("Erro ao deletar categoria:", errorMessage, error);

    if (errorMessage === "Categoria não encontrada") {
      return NextResponse.json(
        { message: "Categoria não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Erro ao deletar categoria: ${errorMessage}` },
      { status: 500 },
    );
  }
}
