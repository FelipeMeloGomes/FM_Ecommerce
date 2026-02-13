import { StripeGateway } from "@/infra/payments/StripeGateway";
import { PaymentGateway } from "@/core/payments/PaymentGateway";

export const paymentGateway: PaymentGateway = new StripeGateway();
