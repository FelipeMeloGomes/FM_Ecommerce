export interface CheckoutItem {
  productId: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
}
export interface CheckoutAddress {
  state?: string;
  zip?: string;
  city?: string;
  address?: string;
  name?: string;
}

export interface CheckoutShipping {
  method?: string;
  carrier?: string;
  price?: number;
  estimatedDays?: number;
}

export interface CheckoutMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: CheckoutAddress;
  shipping?: CheckoutShipping;
}
export interface CheckoutGateway {
  createSession(
    items: CheckoutItem[],
    metadata: CheckoutMetadata,
  ): Promise<string>;
}
