export interface PaymentProduct {
  productId: string;
  quantity: number;
}

export interface PaymentInvoice {
  id: string;
  number: string | null;
  url: string | null;
}

export interface PaymentSession {
  id: string;
  total: number;
  currency: string;
  metadata: Record<string, string>;
  products: PaymentProduct[];
  invoice?: PaymentInvoice;
}
