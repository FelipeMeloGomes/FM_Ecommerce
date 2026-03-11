import type { Transaction } from "@sanity/client";
import { backendClient } from "@/sanity/lib/backendClient";

export async function updateStock(
  items: { productId: string; quantity: number }[],
  transaction?: Transaction,
) {
  for (const item of items) {
    if (!item.productId) {
      console.warn("updateStock: skipping item with empty productId");
      continue;
    }

    const product = await backendClient.getDocument(item.productId);

    if (!product?.stock) continue;

    const newStock = Math.max(product.stock - item.quantity, 0);

    if (transaction) {
      transaction.patch(item.productId, { set: { stock: newStock } });
    } else {
      await backendClient
        .patch(item.productId)
        .set({ stock: newStock })
        .commit();
    }
  }
}
