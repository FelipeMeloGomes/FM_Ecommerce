import { z } from "zod";
import { addressSchema } from "./addressSchema";

const shippingSchema = z.object({
  service: z.string().min(1, "Serviço de entrega é obrigatório"),
  price: z.number().positive("Preço do frete deve ser positivo"),
});

export const checkoutSchema = z.object({
  selectedAddress: addressSchema,
  selectedShipping: shippingSchema,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
