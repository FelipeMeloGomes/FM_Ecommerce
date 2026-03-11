import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),

  price: z.coerce.number().min(0.01, "Preço é obrigatório"),
  discount: z.coerce.number().min(0).max(100),
  stock: z.coerce.number().min(1, "Estoque é obrigatório"),

  weight: z.coerce.number().min(0.01, "Peso é obrigatório"),
  width: z.coerce.number().min(0.01, "Largura é obrigatória"),
  height: z.coerce.number().min(0.01, "Altura é obrigatória"),
  length: z.coerce.number().min(0.01, "Comprimento é obrigatório"),

  variant: z.string().min(1, "Tipo do produto é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  categories: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
  status: z.string().min(1, "Status é obrigatório"),

  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;
