"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/writeClient";

export type CreateAddressInput = {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default?: boolean;
};

export async function createAddress(data: CreateAddressInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await writeClient.create({
    _type: "address",
    ...data,
  });

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
}
