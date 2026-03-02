"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/writeClient";

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

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await writeClient.getDocument(data.id);

  if (!existing) {
    throw new Error("Address not found");
  }

  if (existing.clerkUserId !== userId) {
    throw new Error("Unauthorized action");
  }

  if (data.default) {
    await writeClient
      .patch({
        query: `*[_type == "address" && clerkUserId == $userId && _id != $id]`,
        params: { userId, id: data.id },
      })
      .set({ default: false })
      .commit();
  }

  await writeClient
    .patch(data.id)
    .set({
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      default: data.default ?? false,
    })
    .commit();

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
}
