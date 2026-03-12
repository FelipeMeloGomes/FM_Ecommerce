import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "8vdm88f4",
  dataset: "production",
  apiVersion: "2026-02-13",
  token:
    "skJW8Jp9j9TLbvc34yaScYEUQlpEDmN5bxzBrE5ix4hUGpZoEyUjRhz1rAvcpy5tT9a2IaZBeUVvIZ4w4i6mNnF2Z0wZUyHZQa49pSbMKLWNu2EfOI01EpvSQF8yc5k8Av4n9HwjpL3o6QruSvtniMLGd271vfdovGfjQ9sFYB3lJt78eSAy",
  useCdn: false,
});

async function updateProducts() {
  const products = await client.fetch(`*[_type == "product"]`);

  for (const product of products) {
    await client
      .patch(product._id)
      .set({
        weight: product.weight ?? 0.5,
        width: product.width ?? 15,
        height: product.height ?? 8,
        length: product.length ?? 20,
      })
      .commit();
  }

  console.log("Todos os produtos foram atualizados!");
}

updateProducts().catch(console.error);
