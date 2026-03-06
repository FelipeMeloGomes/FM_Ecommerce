"use server";

import { checkoutGateway } from "@/config/checkoutGateway";
import { urlFor } from "@/sanity/lib/image";
import type { Address } from "@/sanity.types";
import type { CartItem } from "@/store";

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export interface ShippingMetadata {
  method: string;
  price: number;
  estimatedDays?: number;
}

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address: Address;
  shipping: ShippingMetadata;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  const mappedItems = items.map((item) => {
    if (!item.product.name) {
      throw new Error(
        `Product name is missing for product ${item.product._id}`,
      );
    }

    if (item.product.price == null) {
      throw new Error(
        `Product price is missing for product ${item.product._id}`,
      );
    }

    return {
      productId: item.product._id,
      name: item.product.name,
      description: item.product.description,
      image: item.product.images?.length
        ? urlFor(item.product.images[0]).url()
        : undefined,
      price: item.product.price,
      quantity: item.quantity,
    };
  });

  return checkoutGateway.createSession(mappedItems, metadata);
}
