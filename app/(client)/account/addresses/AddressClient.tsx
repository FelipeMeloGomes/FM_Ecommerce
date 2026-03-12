"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { deleteAddress } from "@/actions/deleteAddress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Address } from "@/sanity.types";
import AddressForm from "./AddressForm";

interface AddressClientProps {
  addresses: Address[];
  initialEditId?: string;
}

export default function AddressesClient({
  addresses,
  initialEditId,
}: AddressClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") ?? initialEditId;

  const editingAddress = addresses.find((address) => address._id === editId);

  const handleEdit = (id: string) => {
    router.push(`/account/addresses?edit=${id}`);
  };

  const handleNew = () => {
    router.push(`/account/addresses`);
  };

  return (
    <div className="flex flex-col items-center">
      <AddressForm
        key={editingAddress?._id ?? "new"}
        address={editingAddress}
      />

      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={handleNew}>
          Novo Endereço
        </Button>
      </div>

      <div className="mt-8 max-w-md w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Endereços cadastrados</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {addresses.length === 0 && (
              <p className="text-muted-foreground text-sm text-center">
                Nenhum endereço cadastrado.
              </p>
            )}

            {addresses.map((address: Address) => (
              <div
                key={address._id}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30"
              >
                <div className="grid gap-1">
                  <span className="font-medium">
                    {address.name} {address.default && "(Padrão)"}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {address.address}, {address.city} - {address.state}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {address.zip}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address._id)}
                  >
                    Editar
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => deleteAddress(address._id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
