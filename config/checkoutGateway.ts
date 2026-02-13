import { StripeCheckoutGateway } from "@/infra/payments/StripeCheckoutGateway";
import { CheckoutGateway } from "@/core/payments/CheckoutGateway";

export const checkoutGateway: CheckoutGateway = new StripeCheckoutGateway();
