import { DeleteBrand, UpdateBrand } from "@/core/brands";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  SanityBrandImageGateway,
  SanityBrandRepository,
} from "@/services/brands";
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
    const removeImage = formData.get("_removeImage") === "true";

    const data = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? undefined,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
    };

    if (!data.title) {
      return errorResponse("Título é obrigatório", 400);
    }

    console.log("[PUT /api/admin/brands/[id]]", {
      brandId: id,
      hasImage: !!imageFile && imageFile.size > 0,
      removeImage,
      title: formData.get("title"),
    });

    const useCase = new UpdateBrand(
      new SanityBrandRepository(),
      new SlugService(),
      new SanityBrandImageGateway(),
    );

    await useCase.execute(id, {
      ...data,
      removeImage,
    });

    console.log("[PUT /api/admin/brands/[id]] Sucesso:", { id });

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao atualizar marca:", message, error);
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

    await new DeleteBrand(new SanityBrandRepository()).execute(id);

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao deletar marca:", message, error);
    return errorResponse(message, status);
  }
}
