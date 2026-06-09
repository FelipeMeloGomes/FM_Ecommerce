"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { err, ok, type ServerResult } from "@/lib/server-result";
import { writeClient } from "@/sanity/lib/writeClient";

export async function deleteAddress(id: string): Promise<ServerResult> {
  const { userId } = await auth();

  if (!userId) return err("Unauthorized");

  const existing = await writeClient.getDocument(id);

  if (!existing) return err("Address not found");
  if (existing.clerkUserId !== userId) return err("Unauthorized action");

  await writeClient.delete(id);

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
  return ok();
}
