import type { PaymentSession } from "./PaymentSession";

export interface PaymentGateway {
  verifyWebhook(
    body: string,
    signature: string,
  ): Promise<PaymentSession | null>;
}
