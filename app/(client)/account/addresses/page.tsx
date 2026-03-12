import { getAddresses } from "@/actions/getAddresses";
import AddressesClient from "./AddressClient";

type Props = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function AddressesPage({ searchParams }: Props) {
  const params = await searchParams;
  const addresses = await getAddresses();

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-10 text-center">Meus Endereços</h1>

      <div className="w-full max-w-2xl">
        <AddressesClient addresses={addresses} initialEditId={params.edit} />
      </div>
    </div>
  );
}
