export interface CheckoutItem {
  productId: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface CheckoutMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: unknown;
}
export interface CheckoutGateway {
  createSession(
    items: CheckoutItem[],
    metadata: CheckoutMetadata,
  ): Promise<string>;
}
