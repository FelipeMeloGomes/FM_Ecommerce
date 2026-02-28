import type { CheckoutGateway } from "@/core/payments/CheckoutGateway";
import { StripeCheckoutGateway } from "@/infra/payments/StripeCheckoutGateway";

export const checkoutGateway: CheckoutGateway = new StripeCheckoutGateway();
