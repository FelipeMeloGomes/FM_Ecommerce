import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession } from "../../actions/createCheckoutSession";
import type { Product } from "../../sanity.types";

vi.mock("../../config/checkoutGateway", () => {
  return {
    checkoutGateway: {
      createSession: vi.fn(async (items: unknown[], _metadata: unknown) => {
        return JSON.stringify(items);
      }),
    },
  };
});

vi.mock("../../sanity/lib/image", () => {
  return {
    urlFor: () => ({
      url: () => "https://img.example/test.png",
    }),
  };
});

describe("createCheckoutSession", () => {
  it("mapeia itens e inclui linha de frete corretamente", async () => {
    const product: Product = {
      _id: "prod-1",
      _type: "product",
      _createdAt: "",
      _updatedAt: "",
      _rev: "",
      name: "Produto X",
      price: 100,
      images: [{} as any],
    };

    const items = [{ product, quantity: 2 }];

    const metadata = {
      orderNumber: "ORDER-123",
      customerName: "John Doe",
      customerEmail: "john@example.com",
    };

    const shipping = { service: "SEDEX", price: 29.9 };

    const result = await createCheckoutSession(items, metadata, shipping);

    const parsed = JSON.parse(result) as Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>;

    expect(parsed.length).toBe(2);

    expect(parsed[0].productId).toBe("prod-1");
    expect(parsed[0].name).toBe("Produto X");
    expect(parsed[0].price).toBe(100);
    expect(parsed[0].quantity).toBe(2);

    expect(parsed[1].productId).toBe("shipping:SEDEX");
    expect(parsed[1].name).toBe("Frete - SEDEX");
    expect(parsed[1].price).toBe(29.9);
    expect(parsed[1].quantity).toBe(1);
  });
});
