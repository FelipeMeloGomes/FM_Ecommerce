"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
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
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized");

  const email = user.primaryEmailAddress?.emailAddress;

  const addressPayload = {
    _type: "address",
    clerkUserId: userId,
    email,
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    default: data.default ?? false,
    createdAt: new Date().toISOString(),
  };

  await writeClient.create(addressPayload);

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
}
