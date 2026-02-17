import { ShippingQuote } from "./ShippingQuote";

export interface ShippingGateway {
  calculate(
    zipCode: string,
    items: {
      weight: number;
      width: number;
      height: number;
      length: number;
      quantity: number;
    }[],
  ): Promise<ShippingQuote[]>;
}
