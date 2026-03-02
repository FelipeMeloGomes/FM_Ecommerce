"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAddress } from "@/actions/createAddress";
import { updateAddress } from "@/actions/updateAddress";
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
    <form action={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        name="name"
        defaultValue={address?.name}
        placeholder="Nome (Casa, Trabalho)"
        required
        className="border p-2 w-full"
      />
      <input
        name="address"
        defaultValue={address?.address}
        placeholder="Rua e número"
        required
        className="border p-2 w-full"
      />
      <input
        name="city"
        defaultValue={address?.city}
        placeholder="Cidade"
        required
        className="border p-2 w-full"
      />
      <input
        name="state"
        defaultValue={address?.state}
        maxLength={2}
        placeholder="Estado (GO)"
        required
        className="border p-2 w-full "
      />
      <input
        name="zip"
        value={cep}
        onChange={(e) => handleCepChange(e.target.value)}
        defaultValue={address?.zip}
        placeholder="CEP"
        required
        className="border p-2 w-full"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="default"
          defaultChecked={address?.default}
        />
        Definir como padrão
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading
          ? "Salvando..."
          : address
            ? "Atualizar Endereço"
            : "Salvar Endereço"}
      </button>
    </form>
  );
}
