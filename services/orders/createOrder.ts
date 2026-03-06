import type { PaymentSession } from "@/core/payments/PaymentSession";
import { backendClient } from "@/sanity/lib/backendClient";
import { updateStock } from "./updateStock";

export async function createOrder(session: PaymentSession) {
  const {
    orderNumber,
    customerName,
    customerEmail,
    clerkUserId,
    address,
    shipping,
  } = session.metadata;

  const products = session.products.map((p) => ({
    _key: crypto.randomUUID(),
    product: { _type: "reference", _ref: p.productId },
    quantity: p.quantity,
  }));

  console.log("ADDRESS:", address);
  console.log("SHIPPING:", shipping);

  await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: session.stripePaymentIntentId,
    stripeCustomerId: session.stripeCustomerId,
    customerName,
    email: customerEmail,
    clerkUserId,
    currency: session.currency,
    totalPrice: session.total,
    products,
    status: "paid",
    invoice: session.invoice,
    address,
    shipping,
    orderDate: new Date().toISOString(),
    amountDiscount: 0,
  });

  await updateStock(session.products);
}
