import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/(client)/api/webhook/route";
import { makeWebhookRequest } from "../factories/sharedMocks";

vi.mock("@/config/paymentGateway", () => ({
  paymentGateway: { verifyWebhook: vi.fn() },
}));

vi.mock("@/services/orders/createOrder", () => ({
  createOrder: vi.fn(),
}));

import { paymentGateway } from "@/config/paymentGateway";
import { createOrder } from "@/services/orders/createOrder";

const mockSession = (overrides = {}) => ({
  id: "session-123",
  payment_status: "paid",
  customer_email: "customer@example.com",
  metadata: {
    orderNumber: "order-123",
    clerkUserId: "user-123",
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    address: { street: "Test St", city: "Test City" },
    shipping: { method: "PAC", price: 20 },
  },
  ...overrides,
});

describe("Webhook API — POST /api/webhook", () => {
  beforeEach(() => vi.clearAllMocks());

  it("processa webhook válido e cria ordem", async () => {
    const session = mockSession();
    vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(session as never);
    vi.mocked(createOrder).mockResolvedValue(undefined);

    const body = JSON.stringify({ type: "checkout.session.completed" });
    const signature = "t=123456,v1=abc123";

    const response = await POST(
      makeWebhookRequest({ body: JSON.parse(body), signature }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(paymentGateway.verifyWebhook).toHaveBeenCalledWith(body, signature);
    expect(createOrder).toHaveBeenCalledWith(session);
  });

  it("retorna 200 sem criar ordem quando sessão é nula", async () => {
    vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(null);

    const response = await POST(
      makeWebhookRequest({ body: { type: "charge.refunded" } }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(createOrder).not.toHaveBeenCalled();
  });

  it("retorna 400 quando signature não fornecida", async () => {
    const response = await POST(makeWebhookRequest({ signature: null }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("No signature");
  });

  it("retorna 400 quando verificação da assinatura falha", async () => {
    vi.mocked(paymentGateway.verifyWebhook).mockRejectedValue(
      new Error("Invalid signature"),
    );

    const response = await POST(
      makeWebhookRequest({ signature: "t=123,v1=invalid" }),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Webhook failed");
  });

  it("retorna 400 quando criação de ordem falha", async () => {
    vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
      mockSession() as never,
    );
    vi.mocked(createOrder).mockRejectedValue(new Error("Database error"));

    const response = await POST(makeWebhookRequest());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Webhook failed");
  });

  it("processa múltiplos eventos: cria ordem apenas para checkout.session.completed", async () => {
    const session = mockSession();
    let callCount = 0;
    vi.mocked(paymentGateway.verifyWebhook).mockImplementation(async () => {
      callCount++;
      return callCount === 2 ? null : (session as never);
    });
    vi.mocked(createOrder).mockResolvedValue(undefined);

    const events = [
      { type: "checkout.session.completed" },
      { type: "charge.refunded" },
      { type: "checkout.session.completed" },
    ];

    for (const event of events) {
      const response = await POST(makeWebhookRequest({ body: event }));
      expect(response.status).toBe(200);
    }

    // charge.refunded retorna null → sem ordem; os outros 2 criam
    expect(createOrder).toHaveBeenCalledTimes(2);
  });

  it("passa a signature correta para verifyWebhook", async () => {
    vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
      mockSession() as never,
    );

    const validSignature = "t=1234567890,v1=e1da73b8d0989f7f4ec9d5d0c33e0e";
    const body = JSON.stringify({ type: "checkout.session.completed" });

    await POST(
      makeWebhookRequest({ body: JSON.parse(body), signature: validSignature }),
    );

    expect(paymentGateway.verifyWebhook).toHaveBeenCalledWith(
      body,
      validSignature,
    );
  });

  it("processa webhook com payload complexo", async () => {
    const richSession = mockSession({
      customer_details: { email: "test@example.com", name: "Test User" },
      amount_total: 15999,
      currency: "usd",
      line_items: [
        { id: "item-1", price: { unit_amount: 15999 }, quantity: 1 },
      ],
    });
    vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
      richSession as never,
    );
    vi.mocked(createOrder).mockResolvedValue(undefined);

    const response = await POST(
      makeWebhookRequest({ body: { type: "checkout.session.completed" } }),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(createOrder).toHaveBeenCalledWith(richSession);
  });
});
