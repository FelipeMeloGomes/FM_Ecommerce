import { z } from "zod";

const brazilianZipRegex = /^\d{5}-?\d{3}$/;

export const addressSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zip: z.string().regex(brazilianZipRegex, "CEP inválido (formato: 00000-000)"),
  default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
