import type { SanityOrderRepository } from "@/services/orders/SanityOrderRepository";

export class DeleteOrder {
  constructor(private repo: SanityOrderRepository) {}

  async execute(orderId: string) {
    await this.repo.delete(orderId);
  }
}
