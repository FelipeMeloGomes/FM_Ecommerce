import { z } from "zod";

const brazilianZipRegex = /^\d{5}-?\d{3}$/;

export const addressSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  address: z.string().min(5, "Endereço muito curto"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres").toUpperCase(),
  zip: z.string().regex(brazilianZipRegex, "CEP inválido"),
  default: z.boolean().optional(),
});

export const addressSchemaWithDefault = addressSchema.extend({
  default: z.boolean().default(false),
});

export type AddressInput = z.input<typeof addressSchema>;
