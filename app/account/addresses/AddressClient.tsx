"use client";

import { useState } from "react";
import { deleteAddress } from "@/actions/deleteAddress";
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

      <div className="mt-10 space-y-4 max-w-md w-full mx-auto">
        {addresses.length === 0 && (
          <p className="text-gray-500 text-center">
            Nenhum endereço cadastrado.
          </p>
        )}

        {addresses.map((address: Address) => (
          <div
            key={address._id}
            className="border p-4 rounded-md bg-white shadow-sm"
          >
            <p className="font-semibold">
              {address.name} {address.default && "(Padrão)"}
            </p>

            <p className="text-sm text-gray-600">
              {address.address}, {address.city} - {address.state}
            </p>

            <p className="text-sm text-gray-600">{address.zip}</p>

            <div className="flex gap-4 mt-3">
              <button
                type="button"
                onClick={() => setEditingAddress(address)}
                className="text-blue-600 text-sm"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => deleteAddress(address._id)}
                className="text-red-600 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
