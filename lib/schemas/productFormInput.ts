import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),

  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100),
  stock: z.coerce.number().optional(),

  weight: z.coerce.number().min(0),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  length: z.coerce.number().min(0),

  variant: z.string().min(1, "Selecione o tipo"),
  brand: z.string().min(1, "Selecione a marca"),
  categories: z.array(z.string()).min(1, "Selecione ao menos uma categoria"),

  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductFormInput = z.input<typeof productSchema>;
