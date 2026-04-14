import { z } from "zod";
import { paymentGateway } from "@/config/paymentGateway";
import { createOrder } from "@/services/orders/createOrder";

const webhookMetadataSchema = z.object({
  orderNumber: z.string().min(1, "orderNumber é obrigatório"),
  clerkUserId: z.string().min(1, "clerkUserId é obrigatório"),
  customerName: z.string().min(1, "customerName é obrigatório"),
  customerEmail: z.string().email("email inválido"),
  address: z.unknown(),
  shipping: z.unknown(),
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  console.log(
    "Webhook received, signature:",
    signature ? "present" : "missing",
  );
  console.log("Body length:", body.length);

  if (!signature) {
    console.error("No signature provided");
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  try {
    console.log("Verifying webhook...");
    const session = await paymentGateway.verifyWebhook(body, signature);
    console.log("Session result:", session ? "valid" : "null");

    if (!session) return Response.json({ received: true });

    const metadataValidation = webhookMetadataSchema.safeParse(
      session.metadata,
    );
    if (!metadataValidation.success) {
      console.error("Metadados inválidos:", metadataValidation.error.issues);
      console.error("Session metadata:", session.metadata);
      return Response.json({ error: "Metadados inválidos" }, { status: 400 });
    }

    console.log("Creating order for:", session.metadata.orderNumber);
    await createOrder(session);
    console.log("Order created successfully!");

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 400 });
  }
}
