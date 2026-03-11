import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),

  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100),
  stock: z.coerce.number().optional(),

  weight: z.coerce.number().min(0),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  length: z.coerce.number().min(0),

  variant: z.string().min(1),
  brand: z.string().min(1),

  categories: z.array(z.string()).min(1),

  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;
