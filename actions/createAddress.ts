"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import {
  type addressSchema,
  addressSchemaWithDefault,
} from "@/lib/schemas/addressSchema";
import { err, ok, type ServerResult } from "@/lib/server-result";
import { writeClient } from "@/sanity/lib/writeClient";

export type CreateAddressInput = z.input<typeof addressSchema>;

export async function createAddress(
  data: CreateAddressInput,
): Promise<ServerResult> {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return err("Unauthorized");

  const validated = addressSchemaWithDefault.parse(data);

  const email = user.primaryEmailAddress?.emailAddress;

  const addressPayload = {
    _type: "address",
    clerkUserId: userId,
    email,
    name: validated.name,
    address: validated.address,
    city: validated.city,
    state: validated.state,
    zip: validated.zip,
    default: validated.default ?? false,
    createdAt: new Date().toISOString(),
  };

  await writeClient.create(addressPayload);

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
  return ok();
}
