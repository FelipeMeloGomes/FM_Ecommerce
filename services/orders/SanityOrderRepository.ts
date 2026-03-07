import { backendClient } from "@/sanity/lib/backendClient";

export class SanityOrderRepository {
  async delete(id: string) {
    // Pode usar delete simples, ou soft delete se preferir
    await backendClient.delete(id);
  }
}
