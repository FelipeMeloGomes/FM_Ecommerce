export interface PaymentProduct {
  productId: string;
  quantity: number;
}

export interface PaymentInvoice {
  id: string;
  number: string | null;
  hosted_invoice_url: string | null;
}

export interface PaymentAddress {
  state?: string;
  zip?: string;
  city?: string;
  address?: string;
  name?: string;
}

export interface PaymentShipping {
  method?: string;
  carrier?: string;
  price?: number;
  estimatedDays?: number;
}

export interface PaymentMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  address?: PaymentAddress;
  shipping?: PaymentShipping;
}

export interface PaymentSession {
  id: string;
  stripePaymentIntentId: string;
  stripeCustomerId: string;
  total: number;
  currency: string;
  metadata: PaymentMetadata;
  products: PaymentProduct[];
  invoice?: PaymentInvoice;
}
