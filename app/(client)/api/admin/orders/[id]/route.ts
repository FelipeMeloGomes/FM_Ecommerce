import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { backendClient } from "@/sanity/lib/backendClient";

function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
  }
  console.error(error);
  return NextResponse.json(
    { message: "Erro interno do servidor" },
    { status: 500 },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    await backendClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
