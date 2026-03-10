import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaymentSession } from "@/core/payments/PaymentSession";
import { createOrder } from "@/services/orders/createOrder";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: "clerk-user-123" })),
}));

vi.mock("@/config/checkoutGateway", () => ({
  checkoutGateway: {
    createSession: vi.fn(async () => "https://checkout.stripe.com/session-url"),
  },
}));

vi.mock("@/sanity/lib/image", () => ({
  urlFor: () => ({ url: () => "https://img.example/test.png" }),
}));

vi.mock("@/sanity/lib/backendClient", () => ({
  backendClient: {
    create: vi.fn(),
    createOrReplace: vi.fn(),
    getDocument: vi.fn().mockResolvedValue({ stock: 100 }),
    patch: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnValue({ commit: vi.fn().mockResolvedValue(null) }),
    })),
    transaction: vi.fn(() => ({
      createOrReplace: vi.fn(),
      patch: vi.fn(),
      commit: vi.fn().mockResolvedValue(null),
    })),
  },
}));

import { checkoutGateway } from "@/config/checkoutGateway";
import { backendClient } from "@/sanity/lib/backendClient";

const makePaymentSession = (
  overrides: Partial<PaymentSession> = {},
): PaymentSession =>
  ({
    id: "cs_test_session_123",
    stripePaymentIntentId: "pi_123",
    stripeCustomerId: "cus_123",
    total: 100,
    currency: "BRL",
    metadata: {
      orderNumber: "ORDER-TEST-001",
      customerName: "João Silva",
      customerEmail: "joao@example.com",
      clerkUserId: "clerk-user-123",
      address: { address: "Rua Teste, 123" },
      shipping: { method: "PAC", price: 20 },
    },
    products: [
      { productId: "prod-1", quantity: 2 },
      { productId: "prod-2", quantity: 1 },
    ],
    invoice: { id: "inv_123", number: "INV-001", hosted_invoice_url: null },
    ...overrides,
  }) as unknown as PaymentSession;

describe("Fluxo completo de checkout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("createCheckoutSession injeta clerkUserId nos metadados", async () => {
    const { createCheckoutSession } = await import(
      "@/actions/createCheckoutSession"
    );

    const items = [
      {
        product: {
          _id: "prod-1",
          _type: "product" as const,
          _createdAt: "",
          _updatedAt: "",
          _rev: "",
          name: "Produto Teste",
          price: 50,
          description: "Descrição",
          images: [],
        },
        quantity: 1,
      },
    ] as Parameters<typeof createCheckoutSession>[0];

    const metadata = {
      orderNumber: "ORDER-001",
      customerName: "Maria",
      customerEmail: "maria@example.com",
      address: {
        _id: "addr-1",
        _type: "address" as const,
        _createdAt: "",
        _updatedAt: "",
        _rev: "",
        address: "Av. Teste",
      },
      shipping: { method: "SEDEX", price: 15 },
    };

    const result = await createCheckoutSession(items, metadata);

    expect(checkoutGateway.createSession).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          productId: "prod-1",
          name: "Produto Teste",
          quantity: 1,
        }),
      ]),
      expect.objectContaining({
        clerkUserId: "clerk-user-123",
        orderNumber: "ORDER-001",
      }),
    );

    expect(result).toBe("https://checkout.stripe.com/session-url");
  });

  it("createOrder persiste pedido com clerkUserId correto na transação", async () => {
    const session = makePaymentSession();

    await createOrder(session);

    const transactionMock = vi.mocked(backendClient.transaction);
    expect(transactionMock).toHaveBeenCalled();

    const tx = transactionMock.mock.results[0].value;
    const payload = vi.mocked(tx.createOrReplace).mock.calls[0][0];

    expect(payload._type).toBe("order");
    expect(payload.clerkUserId).toBe("clerk-user-123");
    expect(payload.customerName).toBe("João Silva");
    expect(payload.email).toBe("joao@example.com");
    expect(payload.products).toHaveLength(2);

    expect(tx.commit).toHaveBeenCalled();
  });

  it("updateStock decrementa estoque dos produtos comprados", async () => {
    const session = makePaymentSession();

    vi.mocked(backendClient.getDocument)
      .mockResolvedValueOnce({ stock: 50 } as never)
      .mockResolvedValueOnce({ stock: 30 } as never);

    await createOrder(session);

    expect(backendClient.getDocument).toHaveBeenCalledTimes(2);

    const transactionMock = vi.mocked(backendClient.transaction);
    const tx = transactionMock.mock.results[0].value;

    expect(tx.patch).toHaveBeenCalledWith("prod-1", {
      set: { stock: 48 },
    });
    expect(tx.patch).toHaveBeenCalledWith("prod-2", {
      set: { stock: 29 },
    });
  });
});
