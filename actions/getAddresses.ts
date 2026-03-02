"use server";

import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import type { Address } from "@/sanity.types";

export async function getAddresses(): Promise<Address[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const query = `
    *[_type=="address" && clerkUserId==$userId]
    | order(createdAt desc)
  `;

  return await client.fetch(query, { userId });
}
