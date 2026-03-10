import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import { backendClient } from "@/sanity/lib/backendClient";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await backendClient.delete(id);

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";
    console.error(error);
    return errorResponse(message, status);
  }
}
