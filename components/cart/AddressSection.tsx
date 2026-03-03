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
    <div className="mt-5">
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={selectedAddressId ?? ""}
            onValueChange={(value) => onSelectAddress(value)}
            className="space-y-3"
          >
            {addresses.map((address) => (
              <div
                key={address._id}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30"
              >
                <div className="flex items-start gap-2 flex-1">
                  <RadioGroupItem
                    value={address._id}
                    id={`address-${address._id}`}
                  />
                  <Label
                    htmlFor={`address-${address._id}`}
                    className="grid gap-1 cursor-pointer"
                  >
                    <span className="font-medium">
                      {address.name} {address.default && "(Padrão)"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {address.address}, {address.city}, {address.state}{" "}
                      {address.zip}
                    </span>
                  </Label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/account/addresses")}
                  >
                    Novo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/account/addresses?edit=${address._id}`)
                    }
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => onDeleteAddress(address._id)}
                  >
                    Apagar
                  </Button>
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
