import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  address: z.string().min(5, "Endereço muito curto"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras").toUpperCase(),
  zip: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  default: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
