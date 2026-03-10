import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  discount: z
    .number()
    .min(0)
    .max(100, "Desconto deve estar entre 0 e 100")
    .default(0),
  stock: z
    .number()
    .int("Estoque deve ser inteiro")
    .min(0, "Estoque não pode ser negativo")
    .default(0),
  weight: z.number().positive("Peso deve ser positivo"),
  width: z.number().positive("Largura deve ser positiva"),
  height: z.number().positive("Altura deve ser positiva"),
  length: z.number().positive("Comprimento deve ser positivo"),
  status: z.string().optional(),
  variant: z.string().optional(),
  isFeatured: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  brand: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
