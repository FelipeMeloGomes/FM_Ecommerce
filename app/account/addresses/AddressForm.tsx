"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAddress } from "@/actions/createAddress";
import { updateAddress } from "@/actions/updateAddress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCep, isValidCep } from "@/helpers/validateCep";
import type { Address } from "@/sanity.types";

interface AddressFormProps {
  address?: Address;
}

export default function AddressForm({ address }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [cep, setCep] = useState(address?.zip ?? "");
  const router = useRouter();

  const handleCepChange = (value: string) => {
    setCep(formatCep(value));
  };

  const handleSubmit = async (formData: FormData) => {
    if (!isValidCep(cep)) {
      toast.error("CEP inválido. Use 12345678 ou 12345-678");
      setLoading(false);
      return;
    }
    setLoading(true);

    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: cep,
      default: formData.get("default") === "on",
    };

    try {
      if (address?._id) {
        await updateAddress({
          id: address._id,
          ...data,
        });

        toast.success("Endereço atualizado!");
      } else {
        await createAddress(data);
        toast.success("Endereço criado!");
      }

      router.push("/cart");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-6 max-w-md mx-auto bg-white border rounded-md p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          defaultValue={address?.name}
          placeholder="Casa, Trabalho"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={address?.address}
          placeholder="Rua e número"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            defaultValue={address?.city}
            placeholder="Cidade"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            name="state"
            defaultValue={address?.state}
            maxLength={2}
            placeholder="GO"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip">CEP</Label>
        <Input
          id="zip"
          name="zip"
          value={cep}
          onChange={(e) => handleCepChange(e.target.value)}
          placeholder="00000-000"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="default"
          name="default"
          defaultChecked={address?.default}
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
