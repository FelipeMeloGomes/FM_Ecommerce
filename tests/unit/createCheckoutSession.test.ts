import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: "user_test_123" })),
}));

vi.mock("../../config/checkoutGateway", () => ({
  checkoutGateway: {
    createSession: vi.fn(async (_items: unknown, metadata: unknown) => {
      return JSON.stringify({ items: _items, metadata });
    }),
  },
}));

vi.mock("../../sanity/lib/image", () => ({
  urlFor: () => ({
    url: () => "https://img.example/test.png",
  }),
}));

import { createCheckoutSession } from "../../actions/createCheckoutSession";
import type { Address, Product } from "../../sanity.types";

// ✅ Declarado fora dos testes — acessível em todos
const mockAddress: Address = {
  _id: "addr-1",
  _type: "address",
  _createdAt: "",
  _updatedAt: "",
  _rev: "",
};

const mockProduct: Product = {
  _id: "prod-1",
  _type: "product",
  _createdAt: "",
  _updatedAt: "",
  _rev: "",
  name: "Produto X",
  price: 100,
  images: [],
};

describe("createCheckoutSession", () => {
  it("mapeia itens corretamente e injeta clerkUserId", async () => {
    const result = await createCheckoutSession(
      [{ product: mockProduct, quantity: 2 }],
      {
        orderNumber: "ORDER-123",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        address: mockAddress,
        shipping: { method: "PAC", price: 28.39, estimatedDays: 9 },
      },
    );

    const parsed = JSON.parse(result);

    expect(parsed.items.length).toBe(1);
    expect(parsed.items[0].productId).toBe("prod-1");
    expect(parsed.items[0].name).toBe("Produto X");
    expect(parsed.items[0].price).toBe(100);
    expect(parsed.items[0].quantity).toBe(2);
    expect(parsed.metadata.clerkUserId).toBe("user_test_123");
  });

  it("lança erro se usuário não autenticado", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    await expect(
      createCheckoutSession([{ product: mockProduct, quantity: 1 }], {
        orderNumber: "O1",
        customerName: "X",
        customerEmail: "x@x.com",
        address: mockAddress,
        shipping: { method: "PAC", price: 10 },
      }),
    ).rejects.toThrow("Usuário não autenticado.");
  });
});
