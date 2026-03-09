"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface AddressFormState {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
}

export default function AddressForm({ address }: AddressFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<AddressFormState>({
    name: address?.name ?? "",
    address: address?.address ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    zip: address?.zip ?? "",
    default: address?.default ?? false,
  });

  useEffect(() => {
    setForm({
      name: address?.name ?? "",
      address: address?.address ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      zip: address?.zip ?? "",
      default: address?.default ?? false,
    });
  }, [address]);

  const handleChange = (
    field: keyof AddressFormState,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isValidCep(form.zip)) {
      toast.error("CEP inválido. Use 12345678 ou 12345-678");
      return;
    }

    setLoading(true);

    try {
      if (address?._id) {
        await updateAddress({ id: address._id, ...form });
        toast.success("Endereço atualizado!");
      } else {
        await createAddress(form);
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
      action={handleSubmit}
      className="space-y-6 max-w-md mx-auto bg-white border rounded-md p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Casa, Trabalho"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Rua e número"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Cidade"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
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
          value={form.zip}
          onChange={(e) => handleChange("zip", formatCep(e.target.value))}
          placeholder="00000-000"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="default"
          checked={form.default}
          onCheckedChange={(checked) =>
            handleChange("default", checked === true)
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
