import type { BrandRepository } from "./BrandRepository";

export class DeleteBrand {
  constructor(private repository: BrandRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error("Marca não encontrada");
    }

    await this.repository.delete(id);
  }
}
