import type { PaymentGateway } from "@/core/payments/PaymentGateway";
import { StripeGateway } from "@/infra/payments/StripeGateway";

export const paymentGateway: PaymentGateway = new StripeGateway();
