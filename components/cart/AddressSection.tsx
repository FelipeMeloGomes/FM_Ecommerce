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
      <div className="bg-card border border-border/60 rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Você ainda não possui um endereço cadastrado.
        </p>
        <Link href="/account/addresses">
          <Button className="bg-shop_dark_green hover:bg-shop_btn_dark_green">
            Cadastrar Endereço
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="bg-muted/20 border-b border-border/40">
        <CardTitle>Endereço de Entrega</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <RadioGroup
          value={selectedAddressId ?? ""}
          onValueChange={(value) => onSelectAddress(value)}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div
              key={address._id}
              className="flex items-center justify-between rounded-lg border border-border/40 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <RadioGroupItem
                  value={address._id}
                  id={`address-${address._id}`}
                />
                <Label
                  htmlFor={`address-${address._id}`}
                  className="grid gap-1 cursor-pointer"
                >
                  <span className="font-medium flex items-center gap-2">
                    {address.name}
                    {address.default && (
                      <span className="text-xs bg-shop_orange/10 text-shop_orange px-2 py-0.5 rounded-full">
                        Padrão
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {address.address}, {address.city}, {address.state} -{" "}
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
                  className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
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
  );
};

export default AddressSection;
