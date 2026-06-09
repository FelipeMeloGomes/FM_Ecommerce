import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().min(1, "productId é obrigatório"),
  rating: z
    .number()
    .int()
    .min(1, "Rating deve ser no mínimo 1")
    .max(5, "Rating deve ser no máximo 5"),
  title: z
    .string()
    .min(3, "Título deve ter entre 3 e 100 caracteres")
    .max(100, "Título deve ter entre 3 e 100 caracteres"),
  comment: z
    .string()
    .min(20, "Comentário deve ter entre 20 e 1000 caracteres")
    .max(1000, "Comentário deve ter entre 20 e 1000 caracteres"),
  images: z.array(z.instanceof(File)).optional(),
  keepImageIds: z.array(z.string()).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
