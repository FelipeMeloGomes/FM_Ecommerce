"use client";

import { useEffect, useState } from "react";
import { calculateShipping } from "@/actions/calculateShipping";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import { formatCep, isValidCep } from "@/helpers/validateCep";
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

  const handleChange = (value: string) => {
    setCep(formatCep(value));
  };

  const handleCalculate = async () => {
    if (!isValidCep(cep)) {
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
    <div className="space-y-4 p-4 md:p-5">
      <div className="space-y-2">
        <Label className="text-sm">CEP</Label>
        <div className="flex gap-2">
          <Input
            value={cep}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="00000-000"
          />
          <Button
            type="button"
            onClick={handleCalculate}
            disabled={loading}
            className="shrink-0"
          >
            {loading ? "Calculando..." : "Calcular"}
          </Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      {quotes.length > 0 && (
        <RadioGroup
          value={selectedShipping?.service ?? ""}
          onValueChange={(value) => {
            const quote = quotes.find((q) => q.service === value) ?? null;
            onSelectShipping(quote);
          }}
          className="space-y-2"
        >
          {quotes.map((q) => (
            <div
              key={q.service}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/30"
            >
              <div className="flex items-start gap-2">
                <RadioGroupItem id={`ship-${q.service}`} value={q.service} />
                <Label
                  htmlFor={`ship-${q.service}`}
                  className="grid gap-1 cursor-pointer"
                >
                  <span className="font-medium">{q.service}</span>
                  <span className="text-sm text-muted-foreground">
                    {q.deliveryDays} dias úteis
                  </span>
                </Label>
              </div>
              <PriceFormatter amount={q.price} className="font-semibold" />
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
