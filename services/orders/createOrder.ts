import { PaymentSession } from "@/core/payments/PaymentSession";
import { backendClient } from "@/sanity/lib/backendClient";
import { updateStock } from "./updateStock";

export async function createOrder(session: PaymentSession) {
  const { orderNumber, customerName, customerEmail, clerkUserId, address } =
    session.metadata;

  const parsedAddress = address ? JSON.parse(address) : null;

  const products = session.products.map((p) => ({
    _key: crypto.randomUUID(),
    product: { _type: "reference", _ref: p.productId },
    quantity: p.quantity,
  }));

  await backendClient.create({
    _type: "order",
    orderNumber,
    customerName,
    email: customerEmail,
    clerkUserId,
    currency: session.currency,
    totalPrice: session.total,
    products,
    status: "paid",
    invoice: session.invoice,
    address: parsedAddress,
  });

  await updateStock(session.products);
}
