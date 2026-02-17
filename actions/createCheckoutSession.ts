"use server";

import { checkoutGateway } from "@/config/checkoutGateway";
import { Address } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartItem } from "@/store";

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export interface ShippingItem {
  service: string;
  price: number;
}

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | null;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
  shipping: ShippingItem,
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

  mappedItems.push({
    productId: `shipping:${shipping.service}`,
    name: `Frete - ${shipping.service}`,
    description: "Serviço de entrega",
    image: undefined,
    price: shipping.price,
    quantity: 1,
  });

  return checkoutGateway.createSession(mappedItems, metadata);
}
