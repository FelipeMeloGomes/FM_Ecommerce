"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { err, ok, type ServerResult } from "@/lib/server-result";
import { writeClient } from "@/sanity/lib/writeClient";
import { GET_OTHER_ADDRESSES_QUERY } from "@/sanity/queries/query";

export type UpdateAddressInput = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default?: boolean;
};

export async function updateAddress(
  data: UpdateAddressInput,
): Promise<ServerResult> {
  const { userId } = await auth();

  if (!userId) return err("Unauthorized");

  const existing = await writeClient.getDocument(data.id);

  if (!existing) return err("Address not found");
  if (existing.clerkUserId !== userId) return err("Unauthorized action");

  const updatePayload = {
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    default: data.default ?? false,
  };

  await Promise.all([
    data.default
      ? writeClient
          .patch({
            query: GET_OTHER_ADDRESSES_QUERY,
            params: { userId, id: data.id },
          })
          .set({ default: false })
          .commit()
      : Promise.resolve(),

    writeClient.patch(data.id).set(updatePayload).commit(),
  ]);

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
  return ok();
}
