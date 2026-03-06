import { createClient } from "@sanity/client";

const client = createClient({
  projectId: `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
  dataset: `${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
  apiVersion: "2026-02-13",
  token: `${process.env.SANITY_TOKEN_ADM}`,
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
