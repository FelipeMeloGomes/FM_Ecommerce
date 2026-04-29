"use server";

import { auth } from "@clerk/nextjs/server";
import { checkoutGateway } from "@/config/checkoutGateway";
import { err, ok, type ServerResult } from "@/lib/server-result";
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
): Promise<ServerResult<string>> {
  const { userId } = await auth();

  if (!userId) return err("Usuário não autenticado.");

  const productRepo = new SanityProductRepository();

  for (const item of items) {
    const product = await productRepo.findById(item.product._id);

    if (!product) {
      return err(`Produto não encontrado: ${item.product.name}`);
    }

    if (product.stock < item.quantity) {
      return err(
        `Produto "${product.name}" possui apenas ${product.stock} unidades em estoque. Você solicitou ${item.quantity}.`,
      );
    }
  }

  const mappedItems = items
    .map((item) => {
      if (!item.product.name) return null;

      if (item.product.price == null) return null;

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
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (mappedItems.length === 0) {
    return err("Nenhum produto válido no carrinho.");
  }

  const sessionUrl = await checkoutGateway.createSession(mappedItems, {
    ...metadata,
    clerkUserId: userId,
  });

  return ok(sessionUrl);
}
