"use server";

import { shippingGateway } from "@/config/shippingGateway";

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
  return shippingGateway.calculate(zipCode, items);
}
