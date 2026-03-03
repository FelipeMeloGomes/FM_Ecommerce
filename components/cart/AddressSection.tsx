"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Address } from "@/sanity.types";

interface AddressSectionProps {
  addresses: Address[];
  selectedAddressId?: string;
  onSelectAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void | Promise<void>;
}

const AddressSection = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onDeleteAddress,
}: AddressSectionProps) => {
  const router = useRouter();

  if (!addresses.length) {
    return (
      <div className="bg-white rounded-md mt-5 p-6 border text-center">
        <p className="text-gray-600 mb-4">
          Você ainda não possui um endereço cadastrado.
        </p>
        <Link href="/account/addresses">
          <Button className="rounded-full">Cadastrar Endereço</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md mt-5">
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAddressId ?? ""}
            onValueChange={(value) => onSelectAddress(value)}
          >
            {addresses.map((address) => (
              <div
                key={address._id}
                className="flex flex-col items-start justify-between mb-4"
              >
                <div className="flex items-start space-x-2 flex-1">
                  <RadioGroupItem
                    value={address._id}
                    id={`address-${address._id}`}
                  />

                  <Label
                    htmlFor={`address-${address._id}`}
                    className="grid gap-1.5 cursor-pointer"
                  >
                    <span className="font-semibold">
                      {address.name} {address.default && "(Padrão)"}
                    </span>
                    <span className="text-sm text-black/60">
                      {address.address}, {address.city}, {address.state}{" "}
                      {address.zip}
                    </span>
                  </Label>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => router.push("/account/addresses")}
                    className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-100 transition"
                  >
                    Novo endereço
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/account/addresses?edit=${address._id}`)
                    }
                    className="px-3 py-1.5 text-sm border rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Editar endereço
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteAddress(address._id)}
                    className="px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                  >
                    Apagar endereço
                  </button>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressSection;
