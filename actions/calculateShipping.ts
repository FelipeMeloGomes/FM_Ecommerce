"use server";

import { z } from "zod";
import { shippingGateway } from "@/config/shippingGateway";

const shippingItemSchema = z.object({
  weight: z.number().positive("Peso deve ser positivo"),
  width: z.number().positive("Largura deve ser positiva"),
  height: z.number().positive("Altura deve ser positiva"),
  length: z.number().positive("Comprimento deve ser positivo"),
  quantity: z.number().int().positive("Quantidade deve ser maior que zero"),
});

const calculateShippingSchema = z.object({
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)"),
  items: z.array(shippingItemSchema).min(1, "Ao menos um item é necessário"),
});

export async function calculateShipping(
  zipCode: string,
  items: {
    weight: number;
    width: number;
    height: number;
    length: number;
    quantity: number;
  }[],
) {
  const validated = calculateShippingSchema.parse({ zipCode, items });
  return shippingGateway.calculate(validated.zipCode, validated.items);
}
