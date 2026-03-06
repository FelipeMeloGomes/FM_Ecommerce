import { describe, expect, it, vi } from "vitest";
import { createCheckoutSession } from "../../actions/createCheckoutSession";
import type { Product } from "../../sanity.types";

vi.mock("../../config/checkoutGateway", () => {
  return {
    checkoutGateway: {
      createSession: vi.fn(async (items: unknown[]) => {
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
  it("mapeia itens corretamente", async () => {
    const product: Product = {
      _id: "prod-1",
      _type: "product",
      _createdAt: "",
      _updatedAt: "",
      _rev: "",
      name: "Produto X",
      price: 100,
      images: [],
    };

    const items = [{ product, quantity: 2 }];

    const metadata = {
      orderNumber: "ORDER-123",
      customerName: "John Doe",
      customerEmail: "john@example.com",
    };

    const result = await createCheckoutSession(items, metadata);

    const parsed = JSON.parse(result);

    expect(parsed.length).toBe(1);

    expect(parsed[0].productId).toBe("prod-1");
    expect(parsed[0].name).toBe("Produto X");
    expect(parsed[0].price).toBe(100);
    expect(parsed[0].quantity).toBe(2);
  });
});
