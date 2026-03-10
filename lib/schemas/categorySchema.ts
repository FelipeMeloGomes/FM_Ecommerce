import { z } from "zod";

export const categorySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  range: z.number().positive("Range deve ser positivo").optional(),
  featured: z.boolean().default(false),
  image: z.instanceof(File).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
