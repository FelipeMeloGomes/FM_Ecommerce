import { paymentGateway } from "@/config/paymentGateway";
import { createOrder } from "@/services/orders/createOrder";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature)
    return Response.json({ error: "No signature" }, { status: 400 });

  try {
    const session = await paymentGateway.verifyWebhook(body, signature);

    if (!session) return Response.json({ received: true });

    await createOrder(session);

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 400 });
  }
}
