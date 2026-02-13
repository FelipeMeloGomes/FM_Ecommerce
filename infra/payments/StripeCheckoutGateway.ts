import Stripe from "stripe";
import { CheckoutGateway } from "@/core/payments/CheckoutGateway";
import {
  CheckoutItem,
  CheckoutMetadata,
} from "@/core/payments/CheckoutGateway";

export class StripeCheckoutGateway implements CheckoutGateway {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  async createSession(
    items: CheckoutItem[],
    metadata: CheckoutMetadata,
  ): Promise<string> {
    const customers = await this.stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data[0]?.id;

    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        ...metadata,
        address: JSON.stringify(metadata.address),
      },
      mode: "payment",
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,

      line_items: items.map((item) => ({
        price_data: {
          currency: "BRL",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            description: item.description,
            metadata: { id: item.productId },
            images: item.image ? [item.image] : undefined,
          },
        },
        quantity: item.quantity,
      })),

      customer: customerId,
      customer_email: customerId ? undefined : metadata.customerEmail,
    });

    return session.url!;
  }
}
