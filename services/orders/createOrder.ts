import type { PaymentSession } from "@/core/payments/PaymentSession";
import { backendClient } from "@/sanity/lib/backendClient";
import { updateStock } from "./updateStock";

export async function createOrder(session: PaymentSession) {
  const {
    orderNumber,
    customerName,
    customerEmail,
    address,
    shipping,
    clerkUserId,
  } = session.metadata;

  if (!clerkUserId) {
    throw new Error("Clerk User ID não encontrado");
  }

  const products = session.products.map((p) => ({
    _key: crypto.randomUUID(),
    product: { _type: "reference", _ref: p.productId },
    quantity: p.quantity,
  }));

  const orderPayload = {
    _type: "order",
    _id: `order-${orderNumber}`,
    clerkUserId,
    orderNumber,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: session.stripePaymentIntentId,
    stripeCustomerId: session.stripeCustomerId,
    customerName,
    email: customerEmail,
    currency: session.currency,
    totalPrice: session.total,
    products,
    status: "paid",
    invoice: session.invoice,
    address,
    shipping,
    orderDate: new Date().toISOString(),
    amountDiscount: 0,
  };

  const transaction = backendClient.transaction();
  transaction.createOrReplace(orderPayload);

  await updateStock(session.products, transaction);
  await transaction.commit();
}
