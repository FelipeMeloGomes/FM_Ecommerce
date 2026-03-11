import { describe, expect, it, vi } from "vitest";
import { makeAddress, makeProduct } from "../factories/entityFactories";

vi.mock("server-only", () => ({}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: "user_test_123" })),
}));

vi.mock("../../config/checkoutGateway", () => ({
  checkoutGateway: {
    createSession: vi.fn(async (_items: unknown, metadata: unknown) =>
      JSON.stringify({ items: _items, metadata }),
    ),
  },
}));

vi.mock("../../sanity/lib/image", () => ({
  urlFor: () => ({ url: () => "https://img.example/test.png" }),
}));

vi.mock("../../services/products/SanityProductRepository", () => ({
  SanityProductRepository: vi.fn().mockImplementation(() => ({
    findById: vi.fn().mockResolvedValue({
      _id: "prod-1",
      name: "Produto X",
      price: 100,
      stock: 10,
    }),
  })),
}));

import { auth } from "@clerk/nextjs/server";
import { createCheckoutSession } from "../../actions/createCheckoutSession";

const product = makeProduct({
  _id: "prod-1",
  name: "Produto X",
  price: 100,
  images: [],
  stock: 10,
});
const address = makeAddress({ _id: "addr-1" });

const baseMetadata = {
  orderNumber: "ORDER-123",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  address,
  shipping: { method: "PAC", price: 28.39, estimatedDays: 9 },
};

describe("createCheckoutSession", () => {
  it("mapeia itens corretamente e injeta clerkUserId", async () => {
    const result = await createCheckoutSession(
      [{ product, quantity: 2 }],
      baseMetadata,
    );
    const parsed = JSON.parse(result);

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0]).toMatchObject({
      productId: "prod-1",
      name: "Produto X",
      price: 100,
      quantity: 2,
    });
    expect(parsed.metadata.clerkUserId).toBe("user_test_123");
  });

  it("lança erro se usuário não autenticado", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    await expect(
      createCheckoutSession([{ product, quantity: 1 }], {
        ...baseMetadata,
        orderNumber: "O1",
        customerName: "X",
        customerEmail: "x@x.com",
      }),
    ).rejects.toThrow("Usuário não autenticado.");
  });
});
