import type { Metadata } from "@/actions/createCheckoutSession";
import type { ServerResult } from "@/lib/server-result";
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
  ) => Promise<ServerResult<string>>;
}

export async function performCheckout(
  items: { product: CartItem["product"]; quantity: number }[],
  user: ClerkUser | null | undefined,
  selectedAddress: Address | null | undefined,
  shipping: ShippingItem | null | undefined,
  deps: CheckoutDeps,
): Promise<ServerResult<string>> {
  if (!selectedAddress) {
    return { success: false, error: "Selecione um endereço de entrega" };
  }
  if (!shipping) {
    return { success: false, error: "Selecione uma opção de frete" };
  }

  const metadata: Metadata = {
    orderNumber: crypto.randomUUID(),
    customerName: user?.fullName ?? "Unknown",
    customerEmail: user?.emailAddresses?.[0]?.emailAddress ?? "Unknown",
    address: selectedAddress,
    shipping: {
      method: shipping.service,
      price: shipping.price,
      estimatedDays: shipping.deliveryDays,
    },
  };

  const result = await deps.createCheckoutSession(items, metadata);

  return result;
}
