import { NextResponse } from "next/server";
import { CreateCategory } from "@/core/categories/CreateCategory";
import { requireAdmin } from "@/lib/requireAdmin";
import { SanityCategoryImageGateway } from "@/services/categories/SanityCategoryImageGateway";
import { SanityCategoryRepository } from "@/services/categories/SanityCategoryRepository";
import { SlugService } from "@/services/products/SlugService";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    const useCase = new CreateCategory(
      new SanityCategoryRepository(),
      new SlugService(),
      new SanityCategoryImageGateway(),
    );

    await useCase.execute({
      title: String(formData.get("title")),
      description: formData.get("description")?.toString(),
      range: formData.get("range")
        ? Number(formData.get("range"))
        : undefined,
      featured: formData.get("featured") === "true",
      imageFile: imageFile || undefined,
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
