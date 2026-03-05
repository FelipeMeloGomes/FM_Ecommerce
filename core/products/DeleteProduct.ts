import type { ProductRepository } from "./ProductRepository";

export class DeleteProduct {
  constructor(private repository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    await this.repository.delete(id);
  }
}
