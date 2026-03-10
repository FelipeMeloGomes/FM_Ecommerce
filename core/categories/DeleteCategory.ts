import type { CategoryRepository } from "./CategoryRepository";

export class DeleteCategory {
  constructor(private repository: CategoryRepository) { }

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new Error("Categoria não encontrada");
    }

    await this.repository.delete(id);
  }
}
