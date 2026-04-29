"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAddress } from "@/actions/createAddress";
import { updateAddress } from "@/actions/updateAddress";
import { FormError } from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCep } from "@/helpers/validateCep";
import { type AddressInput, addressSchema } from "@/lib/schemas/addressSchema";
import type { ServerResult } from "@/lib/server-result";
import type { Address } from "@/sanity.types";

interface AddressFormProps {
  address?: Address;
}

export default function AddressForm({ address }: AddressFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name ?? "",
      address: address?.address ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      zip: address?.zip ?? "",
      default: address?.default ?? false,
    },
  });

  const handleSubmit = async (data: AddressInput) => {
    setLoading(true);

    try {
      let result: ServerResult;
      if (address?._id) {
        result = await updateAddress({ id: address._id, ...data });
      } else {
        result = await createAddress(data);
      }

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(address?._id ? "Endereço atualizado!" : "Endereço criado!");
      router.push("/cart");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!address?._id;

  return (
    <Card className="border-border/60">
      <CardHeader className="bg-muted/20 border-b border-border/40">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="w-5 h-5 text-shop_orange" />
          {isEditing ? "Editar Endereço" : "Novo Endereço"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do endereço</Label>
            <Input
              id="name"
              placeholder="Casa, Trabalho, etc."
              {...form.register("name")}
            />
            <FormError message={form.formState.errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Rua e número"
              {...form.register("address")}
            />
            <FormError message={form.formState.errors.address?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Cidade"
                {...form.register("city")}
              />
              <FormError message={form.formState.errors.city?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                maxLength={2}
                placeholder="GO"
                {...form.register("state")}
              />
              <FormError message={form.formState.errors.state?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">CEP</Label>
            <Input
              id="zip"
              placeholder="00000-000"
              {...form.register("zip")}
              onChange={(e) => form.setValue("zip", formatCep(e.target.value))}
            />
            <FormError message={form.formState.errors.zip?.message} />
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Checkbox
              id="default"
              checked={form.watch("default")}
              onCheckedChange={(checked) =>
                form.setValue("default", checked === true)
              }
            />
            <Label htmlFor="default" className="text-sm text-muted-foreground">
              Definir como endereço padrão
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
          >
            {loading
              ? "Salvando..."
              : isEditing
                ? "Atualizar Endereço"
                : "Salvar Endereço"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
