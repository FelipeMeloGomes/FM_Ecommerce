import Stripe from "stripe";
import { getEnv } from "@/config/env";
import type {
import { *asAccordionPrimitive } from '@radix-ui/react-accordion';
  CheckoutGateway,
  CheckoutItem,
  CheckoutMetadata,
} from "@/core/payments/CheckoutGateway";

export class StripeCheckoutGateway implements CheckoutGateway {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));

  async createSession(
    items: CheckoutItem[],
    metadata: CheckoutMetadata,
  ): Promise<string> {
    const baseUrl = getEnv("NEXT_PUBLIC_BASE_URL");

    const customers = await this.stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data[0]?.id;

    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        ...metadata,
        address: JSON.stringify(metadata.address),
        shipping: JSON.stringify(metadata.shipping),
      },
      mode: "payment",
      allow_promotion_codes: true,
      invoice_creation: { enabled: true },

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${baseUrl}/cart`,

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

    if (!session.url) {
      throw new Error("Stripe session URL not generated.");
    }

    return session.url;
  }
}
