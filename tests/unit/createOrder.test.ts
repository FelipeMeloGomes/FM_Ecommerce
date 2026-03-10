import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendClient } from "@/sanity/lib/backendClient";
import type { PaymentSession } from "../../core/payments/PaymentSession";
import { createOrder } from "../../services/orders/createOrder";

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

const makeSession = (overrides: object = {}): PaymentSession =>
  ({
    id: "sess-1",
    stripePaymentIntentId: "pi_1",
    stripeCustomerId: "cus_1",
    total: 100,
    currency: "USD",
    metadata: {
      orderNumber: "ORDER-1",
      customerName: "Alice",
      customerEmail: "alice@example.com",
      clerkUserId: "clerk-123",
      address: { address: "Alguma rua" },
      shipping: { method: "standard", price: 9 },
    },
    products: [{ productId: "prod-1", quantity: 2 }],
    invoice: { id: "inv-1", number: "INV-1", hosted_invoice_url: null },
    ...overrides,
  }) as unknown as PaymentSession;

describe("createOrder with Clerk User ID", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve salvar clerkUserId no order", async () => {
    await createOrder(makeSession());

    const transactionMock = vi.mocked(backendClient.transaction);
    expect(transactionMock).toHaveBeenCalled();

    const mock = vi.mocked(
      transactionMock.mock.results[0].value.createOrReplace,
    );
    expect(mock).toHaveBeenCalled();

    const payload = mock.mock.calls[0][0];
    expect(payload.clerkUserId).toBe("clerk-123");
  });
});

describe("createOrder sem Clerk User ID", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deve lançar erro quando clerkUserId ausente", async () => {
    const session = makeSession({
      metadata: {
        orderNumber: "ORDER-2",
        customerName: "Bob",
        customerEmail: "bob@example.com",
        address: { address: "Outra rua" },
        shipping: { method: "standard", price: 5 },
      },
    });

    await expect(createOrder(session)).rejects.toThrow(
      "Clerk User ID não encontrado",
    );
  });
});
