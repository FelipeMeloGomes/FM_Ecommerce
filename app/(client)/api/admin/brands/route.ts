import { CreateBrand } from "@/core/brands";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  SanityBrandImageGateway,
  SanityBrandRepository,
} from "@/services/brands";
import { SlugService } from "@/services/products/SlugService";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    const data = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? undefined,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
    };

    if (!data.title) {
      return errorResponse("Título é obrigatório", 400);
    }

    const useCase = new CreateBrand(
      new SanityBrandRepository(),
      new SlugService(),
      new SanityBrandImageGateway(),
    );

    await useCase.execute(data);

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";
    console.error(error);
    return errorResponse(message, status);
  }
}
