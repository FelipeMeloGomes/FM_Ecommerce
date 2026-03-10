import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/(client)/api/webhook/route";

// Mock dependencies
vi.mock("@/config/paymentGateway", () => ({
  paymentGateway: {
    verifyWebhook: vi.fn(),
  },
}));

vi.mock("@/services/orders/createOrder", () => ({
  createOrder: vi.fn(),
}));

import { paymentGateway } from "@/config/paymentGateway";
import { createOrder } from "@/services/orders/createOrder";

describe("Webhook API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/webhook", () => {
    it("deve processar webhook válido do Stripe", async () => {
      const mockSession = {
        id: "session-123",
        payment_status: "paid",
        customer_email: "customer@example.com",
      };

      vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
        mockSession as any,
      );
      vi.mocked(createOrder).mockResolvedValue(undefined);

      const body = JSON.stringify({ type: "checkout.session.completed" });
      const signature = "t=123456,v1=abc123";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": signature,
          },
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(vi.mocked(paymentGateway.verifyWebhook)).toHaveBeenCalledWith(
        body,
        signature,
      );
      expect(vi.mocked(createOrder)).toHaveBeenCalledWith(mockSession);
    });

    it("deve retornar sucesso sem criar ordem se sessão for nula", async () => {
      vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(null);

      const body = JSON.stringify({ type: "charge.refunded" });
      const signature = "t=123456,v1=abc123";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": signature,
          },
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(vi.mocked(paymentGateway.verifyWebhook)).toHaveBeenCalled();
      expect(vi.mocked(createOrder)).not.toHaveBeenCalled();
    });

    it("deve retornar 400 se signature não fornecida", async () => {
      const body = JSON.stringify({ type: "checkout.session.completed" });

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {},
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No signature");
    });

    it("deve retornar 400 em caso de erro na verificação", async () => {
      vi.mocked(paymentGateway.verifyWebhook).mockRejectedValue(
        new Error("Invalid signature"),
      );

      const body = JSON.stringify({ type: "checkout.session.completed" });
      const signature = "t=123456,v1=invalid";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": signature,
          },
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Webhook failed");
    });

    it("deve retornar 400 em caso de erro ao criar ordem", async () => {
      const mockSession = {
        id: "session-123",
        payment_status: "paid",
      };

      vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
        mockSession as any,
      );
      vi.mocked(createOrder).mockRejectedValue(new Error("Database error"));

      const body = JSON.stringify({ type: "checkout.session.completed" });
      const signature = "t=123456,v1=abc123";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": signature,
          },
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Webhook failed");
    });

    it("deve processar múltiplos webhook eventos diferentes", async () => {
      const mockSession = {
        id: "session-123",
        payment_status: "paid",
      };

      // Para o primeiro evento (checkout.session.completed): retorna mockSession
      // Para o segundo evento (charge.refunded): retorna null
      // Para o terceiro evento (checkout.session.completed): retorna mockSession
      let callCount = 0;
      vi.mocked(paymentGateway.verifyWebhook).mockImplementation(async () => {
        callCount++;
        if (callCount === 2) {
          return null; // charge.refunded retorna null
        }
        return mockSession as any;
      });

      vi.mocked(createOrder).mockResolvedValue(undefined);

      const events = [
        { type: "checkout.session.completed" },
        { type: "charge.refunded" },
        { type: "checkout.session.completed" },
      ];

      for (const event of events) {
        const body = JSON.stringify(event);
        const signature = "t=123456,v1=abc123";

        const response = await POST(
          new Request("http://localhost:3000/api/webhook", {
            method: "POST",
            body: body,
            headers: {
              "stripe-signature": signature,
            },
          }),
        );

        expect(response.status).toBe(200);
      }

      // Deve criar 2 ordens (checkout.session.completed) e ignorar charge.refunded
      expect(vi.mocked(createOrder)).toHaveBeenCalledTimes(2);
    });

    it("deve usar assinatura correta do Stripe", async () => {
      const mockSession = {
        id: "session-success",
        payment_status: "paid",
      };

      vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
        mockSession as any,
      );

      const body = JSON.stringify({
        type: "checkout.session.completed",
        data: { object: { id: "session-success" } },
      });
      const validSignature = "t=1234567890,v1=e1da73b8d0989f7f4ec9d5d0c33e0e";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": validSignature,
          },
        }),
      );

      expect(vi.mocked(paymentGateway.verifyWebhook)).toHaveBeenCalledWith(
        body,
        validSignature,
      );
    });

    it("deve retornar 400 se signature não for correta", async () => {
      const body = JSON.stringify({ type: "webhook.event" });

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {},
        }),
      );

      expect(response.status).toBe(400);
    });

    it("deve processar webhook com payload complexo", async () => {
      const mockSession = {
        id: "session-123",
        payment_status: "paid",
        customer_email: "test@example.com",
        customer_details: {
          email: "test@example.com",
          name: "Test User",
        },
        amount_total: 15999,
        currency: "usd",
        line_items: [
          {
            id: "item-1",
            price: {
              unit_amount: 15999,
            },
            quantity: 1,
          },
        ],
      };

      vi.mocked(paymentGateway.verifyWebhook).mockResolvedValue(
        mockSession as any,
      );
      vi.mocked(createOrder).mockResolvedValue(undefined);

      const body = JSON.stringify({
        type: "checkout.session.completed",
        data: { object: mockSession },
      });
      const signature = "t=123456,v1=abc123";

      const response = await POST(
        new Request("http://localhost:3000/api/webhook", {
          method: "POST",
          body: body,
          headers: {
            "stripe-signature": signature,
          },
        }),
      );

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      expect(vi.mocked(createOrder)).toHaveBeenCalledWith(mockSession);
    });
  });
});
