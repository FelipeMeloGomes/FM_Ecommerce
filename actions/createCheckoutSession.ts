"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkoutGateway } from "@/config/checkoutGateway";
import { err, ok, type ServerResult } from "@/lib/server-result";
import { urlFor } from "@/sanity/lib/image";
import type { Address } from "@/sanity.types";
import { SanityProductRepository } from "@/services/products/SanityProductRepository";
import type { CartItem } from "@/store";

const checkoutSessionSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.object({
          _id: z.string().min(1),
          name: z.string().optional(),
          price: z.number().optional(),
          description: z.string().optional(),
          images: z.array(z.unknown()).optional(),
          stock: z.number().optional(),
        }),
        quantity: z.number().int().positive("Quantidade deve ser positiva"),
      }),
      { message: "items deve ser um array não vazio" },
    )
    .min(1, "Pelo menos um item é obrigatório"),
  metadata: z.object({
    orderNumber: z.string().min(1, "orderNumber é obrigatório"),
    customerName: z.string().min(1, "customerName é obrigatório"),
    customerEmail: z.string().email("email inválido"),
    address: z.unknown(),
    shipping: z.object({
      method: z.string().min(1, "Método de envio é obrigatório"),
      price: z.number().positive("Preço do frete deve ser positivo"),
      estimatedDays: z.number().optional(),
    }),
  }),
});

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
  const validated = checkoutSessionSchema.safeParse({ items, metadata });
  if (!validated.success) {
    return err(validated.error.issues[0].message);
  }

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
