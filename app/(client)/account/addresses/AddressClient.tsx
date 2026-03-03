"use client";

import { useState } from "react";
import { deleteAddress } from "@/actions/deleteAddress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Address } from "@/sanity.types";
import AddressForm from "./AddressForm";

interface AddressClientProps {
  addresses: Address[];
  initialEditingAddress?: Address;
}

export default function AddressesClient({
  addresses,
  initialEditingAddress,
}: AddressClientProps) {
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(
    initialEditingAddress,
  );

  return (
    <div className="flex flex-col items-center">
      <AddressForm key={editingAddress?._id} address={editingAddress} />

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
                    onClick={() => setEditingAddress(address)}
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
