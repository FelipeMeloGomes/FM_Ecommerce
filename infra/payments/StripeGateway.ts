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

    return {
      id: session.id,
      total: session.amount_total / 100,
      currency: session.currency,
      metadata: session.metadata as Record<string, string>,

      products: items.data.map((i) => ({
        productId: (i.price?.product as Stripe.Product).metadata.id,
        quantity: i.quantity || 0,
      })),

      invoice: invoice
        ? {
            id: invoice.id,
            number: invoice.number,
            url: invoice.hosted_invoice_url ?? null,
          }
        : undefined,
    };
  }
}
