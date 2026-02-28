"use client";

import { useEffect, useState } from "react";
import { calculateShipping } from "@/actions/calculateShipping";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import type { CartItem } from "@/store";

export function ShippingCalculator({
  cartItems,
  selectedShipping,
  onSelectShipping,
}: {
  cartItems: CartItem[];
  selectedShipping: ShippingQuote | null;
  onSelectShipping: (quote: ShippingQuote | null) => void;
}) {
  const [cep, setCep] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CEP BR
  const CEP_REGEX = /^[0-9]{5}-?[0-9]{3}$/;

  const handleChange = (value: string) => {
    // hifen até 9 caracteres
    const sanitized = value.replace(/[^\d-]/g, "").slice(0, 9);
    setCep(sanitized);
  };

  const handleCalculate = async () => {
    if (!CEP_REGEX.test(cep)) {
      setError("CEP inválido. Use 12345678 ou 12345-678.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mappedItems = cartItems.map((item) => ({
        weight: item.product.weight ?? 0,
        width: item.product.width ?? 0,
        height: item.product.height ?? 0,
        length: item.product.length ?? 0,
        quantity: item.quantity,
      }));

      const result: ShippingQuote[] = await calculateShipping(cep, mappedItems);
      onSelectShipping(null);
      setQuotes(result);
    } catch {
      setError("Não foi possível calcular o frete.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSelectShipping(null);
    setQuotes([]);
  }, [onSelectShipping]);

  return (
    <div className="space-y-4 p-4 rounded-xl">
      <div className="flex gap-2">
        <input
          value={cep}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Digite seu CEP"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="button"
          onClick={handleCalculate}
          disabled={loading}
          className="bg-black text-white px-4 rounded"
        >
          {loading ? "Calculando..." : "Calcular"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {quotes.length > 0 && (
        <div className="space-y-2">
          {quotes.map((q) => {
            const active = selectedShipping?.service === q.service;

            return (
              <button
                type="button"
                key={q.service}
                onClick={() => onSelectShipping(q)}
                className={`w-full flex justify-between p-3 rounded border
                  ${active ? "border-black bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <div className="text-left">
                  <p className="font-medium">{q.service}</p>
                  <p className="text-sm text-gray-500">
                    {q.deliveryDays} dias úteis
                  </p>
                </div>

                <strong>R$ {q.price.toFixed(2)}</strong>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
