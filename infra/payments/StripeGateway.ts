import type Stripe from "stripe";
import { getEnv } from "@/config/env";
import { stripe } from "@/config/stripe";
import type { PaymentGateway } from "@/core/payments/PaymentGateway";
import type { PaymentSession } from "@/core/payments/PaymentSession";

export class StripeGateway implements PaymentGateway {
  async verifyWebhook(
    body: string,
    signature: string,
  ): Promise<PaymentSession | null> {
    const secret = getEnv("STRIPE_WEBHOOK_SECRET");

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (event.type !== "checkout.session.completed") return null;

    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.amount_total || !session.currency) {
      throw new Error("Invalid Stripe session data.");
    }

    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    const items = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const raw = session.metadata as Record<string, string>;

    return {
      id: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      stripeCustomerId: session.customer as string,
      total: session.amount_total / 100,
      currency: session.currency,
      metadata: {
        orderNumber: raw.orderNumber,
        clerkUserId: raw.clerkUserId,
        customerName: raw.customerName,
        customerEmail: raw.customerEmail,
        address: raw.address ? JSON.parse(raw.address) : undefined,
        shipping: raw.shipping ? JSON.parse(raw.shipping) : undefined,
      },

      products: items.data
        .filter((i) => {
          const product = i.price?.product;
          if (typeof product !== "object" || product === null) return true;
          return (product as Stripe.Product).metadata?.type !== "shipping";
        })
        .map((i) => ({
          productId: (i.price?.product as Stripe.Product).metadata?.id,
          quantity: i.quantity || 0,
        }))
        .filter((p) => p.productId),

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
