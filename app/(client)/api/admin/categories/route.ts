import { CreateCategory } from "@/core/categories/CreateCategory";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import { categorySchema } from "@/lib/schemas/categorySchema";
import { SanityCategoryImageGateway } from "@/services/categories/SanityCategoryImageGateway";
import { SanityCategoryRepository } from "@/services/categories/SanityCategoryRepository";
import { SlugService } from "@/services/products/SlugService";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const data = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? undefined,
      range: formData.get("range") ? Number(formData.get("range")) : undefined,
      featured:
        formData.get("featured") !== null &&
        (formData.get("featured") === "true" ||
          formData.get("featured") === "on" ||
          formData.get("featured") === "1"),
      imageFile: formData.get("image")
        ? (formData.get("image") as File)
        : undefined,
    };

    const result = categorySchema.safeParse(data);
    if (!result.success) {
      return errorResponse(result.error.issues[0].message, 400);
    }

    const useCase = new CreateCategory(
      new SanityCategoryRepository(),
      new SlugService(),
      new SanityCategoryImageGateway(),
    );

    await useCase.execute(result.data);

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";
    return errorResponse(message, status);
  }
}
