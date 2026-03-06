import Stripe from "stripe";
import { getEnv } from "@/config/env";
import type { PaymentGateway } from "@/core/payments/PaymentGateway";
import type { PaymentSession } from "@/core/payments/PaymentSession";

export class StripeGateway implements PaymentGateway {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));

  async verifyWebhook(
    body: string,
    signature: string,
  ): Promise<PaymentSession | null> {
    const secret = getEnv("STRIPE_WEBHOOK_SECRET");

    const event = this.stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type !== "checkout.session.completed") return null;

    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.amount_total || !session.currency) {
      throw new Error("Invalid Stripe session data.");
    }

    const invoice = session.invoice
      ? await this.stripe.invoices.retrieve(session.invoice as string)
      : null;

    const items = await this.stripe.checkout.sessions.listLineItems(
      session.id,
      { expand: ["data.price.product"] },
    );

    const raw = session.metadata as Record<string, string>;

    return {
      id: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      stripeCustomerId: session.customer as string,
      total: session.amount_total / 100,
      currency: session.currency,
      metadata: {
        orderNumber: raw.orderNumber,
        customerName: raw.customerName,
        customerEmail: raw.customerEmail,
        address: raw.address ? JSON.parse(raw.address) : undefined,
        shipping: raw.shipping ? JSON.parse(raw.shipping) : undefined,
      },

      products: items.data.map((i) => ({
        productId: (i.price?.product as Stripe.Product).metadata.id,
        quantity: i.quantity || 0,
      })),

      invoice: invoice
        ? {
            id: invoice.id,
            number: invoice.number,
            hosted_invoice_url: invoice.hosted_invoice_url ?? null,
          }
        : undefined,
    };
  }
}
