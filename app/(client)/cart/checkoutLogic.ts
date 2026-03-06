import type { Metadata } from "@/actions/createCheckoutSession";
import type { Address } from "@/sanity.types";
import type { CartItem } from "@/store";

export interface ClerkUser {
  fullName?: string | null;
  emailAddresses?: { emailAddress: string }[];
  id?: string;
}

export interface ShippingItem {
  service: string;
  price: number;
  deliveryDays?: number;
}

export interface CheckoutDeps {
  createCheckoutSession: (
    items: { product: CartItem["product"]; quantity: number }[],
    metadata: Metadata,
  ) => Promise<string>;
}

export async function performCheckout(
  items: { product: CartItem["product"]; quantity: number }[],
  user: ClerkUser | null | undefined,
  selectedAddress: Address | null | undefined,
  shipping: ShippingItem | null | undefined,
  deps: CheckoutDeps,
) {
  if (!selectedAddress) {
    throw new Error("Selecione um endereço de entrega");
  }
  if (!shipping) {
    throw new Error("Selecione uma opção de frete");
  }

  const metadata: Metadata = {
    orderNumber: crypto.randomUUID(),
    customerName: user?.fullName ?? "Unknown",
    customerEmail: user?.emailAddresses?.[0]?.emailAddress ?? "Unknown",
    clerkUserId: user?.id,
    address: selectedAddress,
    shipping: {
      method: shipping.service,
      price: shipping.price,
      estimatedDays: shipping.deliveryDays,
    },
  };

  const url = await deps.createCheckoutSession(items, metadata);

  return url;
}
