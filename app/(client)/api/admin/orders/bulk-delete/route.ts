import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { toHttpStatus } from "@/lib/httpError";
import { requireAdmin } from "@/lib/requireAdmin";
import { backendClient } from "@/sanity/lib/backendClient";

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse("No ids provided", 400);
    }

    await Promise.all(ids.map((id: string) => backendClient.delete(id)));

    return successResponse();
  } catch (error: unknown) {
    const status = toHttpStatus(error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";
    console.error(error);
    return errorResponse(message, status);
  }
}
