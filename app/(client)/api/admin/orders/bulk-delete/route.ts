import { type NextRequest, NextResponse } from "next/server";
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

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });
    }

    await Promise.all(ids.map((id: string) => backendClient.delete(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
