import { z } from "zod";
import { registry } from "@/lib/openapi/registry";

registry.registerPath({
  method: "post",
  path: "/api/webhook",
  summary: "Receive Stripe webhook events",
  description:
    "Recebe eventos de webhook do Stripe (checkout.session.completed). " +
    "Verifica a assinatura com stripe-signature, valida metadados e cria o pedido.",
  tags: ["Webhook"],
  request: {
    body: {
      description: "Raw webhook payload from Stripe",
      required: true,
      content: {
        "text/plain": {
          schema: z.string(),
        },
      },
    },
    headers: z.object({
      "stripe-signature": z
        .string()
        .openapi({ description: "Stripe webhook signature for verification" }),
    }),
  },
  responses: {
    200: {
      description: "Webhook processed successfully",
      content: {
        "application/json": {
          schema: z.object({
            received: z.literal(true),
          }),
        },
      },
    },
    400: {
      description: "Invalid webhook request",
      content: {
        "application/json": {
          schema: z.object({
            error: z.enum([
              "No signature",
              "Metadados inválidos",
              "Webhook failed",
            ]),
          }),
        },
      },
    },
  },
});
