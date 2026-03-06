import { paymentGateway } from "@/config/paymentGateway";
import { createOrder } from "@/services/orders/createOrder";

export async function POST(req: Request) {
  const body = await req.text();
  console.log("📦 Raw body received");

  const signature = req.headers.get("stripe-signature");
  console.log("🔐 Signature exists:", !!signature);

  if (!signature) {
    console.log("❌ Missing Stripe signature");
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  try {
    console.log("🧪 Verifying webhook...");

    const session = await paymentGateway.verifyWebhook(body, signature);

    console.log("🎯 Session returned:", session ? "YES" : "NULL");

    if (!session) {
      console.log("⚠️ Event ignored (not checkout.session.completed)");
      return Response.json({ received: true });
    }

    console.log("📝 Creating order...");
    await createOrder(session);

    console.log("✅ Order created successfully");

    return Response.json({ received: true });
  } catch (err) {
    console.error("🔥 Webhook error:", err);

    return Response.json({ error: "Webhook failed" }, { status: 400 });
  }
}
