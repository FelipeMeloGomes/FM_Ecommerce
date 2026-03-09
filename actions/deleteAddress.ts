"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/writeClient";

export async function deleteAddress(id: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  await writeClient.delete(id);

  revalidatePath("/account/addresses");
  revalidatePath("/cart");
}
