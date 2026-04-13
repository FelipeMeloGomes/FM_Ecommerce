import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const sanitizeString = (val: unknown) => {
  if (typeof val === "string") {
    return sanitizeHtml(val, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
    }) as string;
  }
  return val;
};

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").transform(sanitizeString),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .transform(sanitizeString),

  price: z.number().positive("Preço deve ser positivo"),
  discount: z
    .number()
    .min(0)
    .max(100, "Desconto deve estar entre 0 e 100")
    .default(0),
  stock: z
    .number()
    .int()
    .min(0, "Estoque deve ser maior ou igual a 0")
    .default(0),
  weight: z.number().positive("Peso deve ser positivo").default(0),
  width: z.number().positive("Largura deve ser positiva").default(0),
  height: z.number().positive("Altura deve ser positiva").default(0),
  length: z.number().positive("Comprimento deve ser positivo").default(0),
  status: z.string().optional(),
  variant: z.string().optional(),
  isFeatured: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  brand: z.string().optional(),
  images: z.any().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
