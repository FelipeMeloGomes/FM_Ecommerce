import { getAddresses } from "@/actions/getAddresses";
import CartClient from "./CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  let addresses: Awaited<ReturnType<typeof getAddresses>> = [];

  try {
    addresses = await getAddresses();
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }

  return <CartClient addresses={addresses} />;
}
