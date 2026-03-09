"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
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

export async function updateAddress(data: UpdateAddressInput) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const existing = await writeClient.getDocument(data.id);

  if (!existing) throw new Error("Address not found");
  if (existing.clerkUserId !== userId) throw new Error("Unauthorized action");

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
}
