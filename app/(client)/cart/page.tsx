import { getAddresses } from "@/actions/getAddresses";
import CartClient from "./CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const addresses = await getAddresses();

  return <CartClient addresses={addresses} />;
}
