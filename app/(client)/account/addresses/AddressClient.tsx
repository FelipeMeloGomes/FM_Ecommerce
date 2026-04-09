"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
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

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/account/addresses?edit=${id}`);
    },
    [router],
  );

  const handleEditWrapper = useCallback(
    (id: string) => () => handleEdit(id),
    [handleEdit],
  );

  const handleDelete = useCallback((id: string) => {
    deleteAddress(id);
  }, []);

  const handleDeleteWrapper = useCallback(
    (id: string) => () => handleDelete(id),
    [handleDelete],
  );

  const handleNew = useCallback(() => {
    router.push(`/account/addresses`);
  }, [router]);

  return (
    <div className="space-y-8">
      <AddressForm
        key={editingAddress?._id ?? "new"}
        address={editingAddress}
      />

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNew}
          className="border-shop_orange text-shop_orange hover:bg-shop_orange hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Endereço
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader className="bg-muted/20 border-b border-border/40">
          <CardTitle className="text-lg font-semibold">
            Endereços cadastrados ({addresses.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {addresses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum endereço cadastrado.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione um endereço para facilitar suas compras.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {addresses.map((address: Address) => (
                <div
                  key={address._id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="grid gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {address.name}
                      </span>
                      {address.default && (
                        <span className="text-xs bg-shop_orange/10 text-shop_orange px-2 py-0.5 rounded-full font-medium">
                          Padrão
                        </span>
                      )}
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {address.address}, {address.city} - {address.state}
                    </span>

                    <span className="text-sm text-muted-foreground">
                      CEP: {address.zip}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 ml-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditWrapper(address._id ?? "")}
                      className="border-border hover:border-shop_orange hover:text-shop_orange"
                    >
                      Editar
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
                      onClick={handleDeleteWrapper(address._id ?? "")}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
