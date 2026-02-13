import { backendClient } from "@/sanity/lib/backendClient";

export async function updateStock(
  items: { productId: string; quantity: number }[],
) {
  for (const item of items) {
    const product = await backendClient.getDocument(item.productId);

    if (!product?.stock) continue;

    await backendClient
      .patch(item.productId)
      .set({ stock: Math.max(product.stock - item.quantity, 0) })
      .commit();
  }
}
