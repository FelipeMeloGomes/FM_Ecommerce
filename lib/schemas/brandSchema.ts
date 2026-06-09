import { z } from "zod";

export const brandSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;
