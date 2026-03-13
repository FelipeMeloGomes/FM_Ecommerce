import { DeleteCategory, UpdateCategory } from "@/core/categories";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import { categorySchema } from "@/lib/schemas/categorySchema";
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

    const data = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? undefined,
      range: formData.get("range") ? Number(formData.get("range")) : undefined,
      featured: featuredBoolean,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
    };

    const result = categorySchema.safeParse(data);
    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

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
      ...result.data,
      removeImage,
    });

    console.log("[PUT /api/admin/categories/[id]] Sucesso:", { id });

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao atualizar categoria:", message, error);
    return errorResponse(message, status);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await new DeleteCategory(new SanityCategoryRepository()).execute(id);

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao deletar categoria:", message, error);
    return errorResponse(message, status);
  }
}
