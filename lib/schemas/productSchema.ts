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
    .min(1, "Estoque é obrigatório"),

  weight: z.number().positive("Peso deve ser positivo"),
  width: z.number().positive("Largura deve ser positiva"),
  height: z.number().positive("Altura deve ser positiva"),
  length: z.number().positive("Comprimento deve ser positivo"),

  variant: z.string().min(1, "Tipo do produto é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  categories: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),
  status: z.string().min(1, "Status é obrigatório"),

  isFeatured: z.boolean().default(false),
  images: z.array(z.instanceof(File)).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
