"use server";

import { auth } from "@clerk/nextjs/server";
import { checkoutGateway } from "@/config/checkoutGateway";
import { urlFor } from "@/sanity/lib/image";
import type { Address } from "@/sanity.types";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
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
  address: Address;
  shipping: ShippingMetadata;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  const { userId } = await auth();

  if (!userId) throw new Error("Usuário não autenticado.");

  const productRepo = new SanityProductRepository();

  for (const item of items) {
    const product = await productRepo.findById(item.product._id);

    if (!product) {
      throw new Error(`Produto não encontrado: ${item.product.name}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Produto "${product.name}" possui apenas ${product.stock} unidades em estoque. Você solicitou ${item.quantity}.`,
      );
    }
  }

  const mappedItems = items.map((item) => {
    if (!item.product.name)
      throw new Error(`Product name is missing for product`);

    if (item.product.price == null)
      throw new Error(`Product price is missing for product `);

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

  return checkoutGateway.createSession(mappedItems, {
    ...metadata,
    clerkUserId: userId,
  });
}
