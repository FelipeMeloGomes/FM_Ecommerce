import { z } from "zod";

export const createCategorySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  range: z.coerce.number().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;
export type CreateCategoryOutput = z.output<typeof createCategorySchema>;
