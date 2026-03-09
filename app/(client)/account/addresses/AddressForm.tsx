"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createAddress } from "@/actions/createAddress";
import { updateAddress } from "@/actions/updateAddress";
import { FormError } from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCep } from "@/helpers/validateCep";
import type { Address } from "@/sanity.types";
import { type AddressFormData, addressSchema } from "@/schemas/addressSchema";

interface AddressFormProps {
  address?: Address;
}

export default function AddressForm({ address }: AddressFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<AddressFormData>({
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

  const handleSubmit = async (data: AddressFormData) => {
    setLoading(true);

    try {
      if (address?._id) {
        await updateAddress({ id: address._id, ...data });
        toast.success("Endereço atualizado!");
      } else {
        await createAddress(data);
        toast.success("Endereço criado!");
      }

      router.push("/cart");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 max-w-md mx-auto bg-white border rounded-md p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Casa, Trabalho"
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
          <Input id="city" placeholder="Cidade" {...form.register("city")} />
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

      <div className="flex items-center gap-2">
        <Checkbox
          id="default"
          checked={form.watch("default")}
          onCheckedChange={(checked) =>
            form.setValue("default", checked === true)
          }
        />
        <Label htmlFor="default">Definir como padrão</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Salvando..."
          : address
            ? "Atualizar Endereço"
            : "Salvar Endereço"}
      </Button>
    </form>
  );
}
