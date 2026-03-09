"use server";

import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { GET_ADDRESSES_QUERY } from "@/sanity/queries/query";
import type { Address } from "@/sanity.types";

export async function getAddresses(): Promise<Address[]> {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  return await client.fetch(
    GET_ADDRESSES_QUERY,
    { userId },
    { cache: "no-store" },
  );
}
