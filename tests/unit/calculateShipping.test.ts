import { describe, expect, it, vi } from "vitest";
import { calculateShipping } from "../../actions/calculateShipping";
import type { ShippingQuote } from "../../core/shipping/ShippingQuote";

vi.mock("../../config/shippingGateway", () => {
  return {
    shippingGateway: {
      calculate: vi.fn(async (_zip: string, _items: unknown[]) => {
        const quotes: ShippingQuote[] = [
          { service: "PAC", price: 20.5, deliveryDays: 6 },
          { service: "SEDEX", price: 35.9, deliveryDays: 2 },
        ];
        return quotes;
      }),
    },
  };
});

describe("calculateShipping action", () => {
  it("retorna cotações do gateway", async () => {
    const items = [
      { weight: 1, width: 10, height: 5, length: 20, quantity: 2 },
      { weight: 0.5, width: 5, height: 5, length: 10, quantity: 1 },
    ];
    const quotes = await calculateShipping("12345-678", items);
    expect(quotes).toHaveLength(2);
    expect(quotes[0].service).toBe("PAC");
    expect(quotes[1].service).toBe("SEDEX");
  });
});
