import { NextResponse } from "next/server";
import { DeleteOrder } from "@/core/orders/DeleteOrder";
import { requireAdmin } from "@/lib/requireAdmin";
import { SanityOrderRepository } from "@/services/orders/SanityOrderRepository";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const useCase = new DeleteOrder(new SanityOrderRepository());
    await useCase.execute(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
