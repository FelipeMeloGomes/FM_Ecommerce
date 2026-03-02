import { getAddresses } from "@/actions/getAddresses";
import AddressesClient from "./AddressClient";

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Meus Endereços</h1>

      <div className="w-full max-w-2xl">
        <AddressesClient addresses={addresses} />
      </div>
    </div>
  );
}
