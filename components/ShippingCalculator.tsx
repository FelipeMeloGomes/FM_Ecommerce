"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { calculateShipping } from "@/actions/calculateShipping";
import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ShippingQuote } from "@/core/shipping/ShippingQuote";
import { formatCep, isValidCep } from "@/helpers/validateCep";
import type { CartItem } from "@/store";

interface ShippingCalculatorProps {
  cartItems: CartItem[];
  selectedShipping: ShippingQuote | null;
  onSelectShipping: (quote: ShippingQuote | null) => void;
}

export function ShippingCalculator({
  cartItems,
  selectedShipping,
  onSelectShipping,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selectedShipping) {
      setHasCalculated(true);
    }
  }, [selectedShipping]);

  const handleChange = useCallback((value: string) => {
    setCep(formatCep(value));
  }, []);

  const handleCalculate = useCallback(async () => {
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

      startTransition(() => {
        const previousService = selectedShipping?.service;
        const matchingQuote = result.find((q) => q.service === previousService);

        onSelectShipping(matchingQuote ?? null);
        setQuotes(result);
        setHasCalculated(true);
      });
    } catch {
      setError("Não foi possível calcular o frete.");
    } finally {
      setLoading(false);
    }
  }, [cep, cartItems, onSelectShipping, selectedShipping?.service]);

  const handleShippingSelect = useCallback(
    (value: string) => {
      const quote = quotes.find((q) => q.service === value) ?? null;
      startTransition(() => {
        onSelectShipping(quote);
      });
    },
    [quotes, onSelectShipping],
  );

  const showQuotes = hasCalculated && quotes.length > 0;
  const showSelectedOnly = hasCalculated && !showQuotes && selectedShipping;

  return (
    <div className="space-y-4 p-4 bg-card border border-border/60 rounded-xl">
      <div className="space-y-3">
        <Label className="text-sm font-medium">CEP de entrega</Label>
        <div className="flex gap-2">
          <Input
            value={cep}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="00000-000"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleCalculate}
            disabled={loading || isPending}
            className="bg-shop_dark_green hover:bg-shop_btn_dark_green shrink-0"
          >
            {loading ? "..." : "Calcular"}
          </Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      {showQuotes && (
        <RadioGroup
          value={selectedShipping?.service ?? ""}
          onValueChange={handleShippingSelect}
          className="space-y-2"
        >
          {quotes.map((q) => (
            <div
              key={q.service}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer ${
                selectedShipping?.service === q.service
                  ? "border-shop_dark_green bg-shop_dark_green/5"
                  : "border-border/40 hover:bg-muted/30"
              }`}
              onClick={() => handleShippingSelect(q.service)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleShippingSelect(q.service);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  id={`ship-${q.service}`}
                  value={q.service}
                  className="mt-0.5"
                />
                <div className="grid gap-1">
                  <span className="font-medium">{q.service}</span>
                  <span className="text-sm text-muted-foreground">
                    {q.deliveryDays} dias úteis
                  </span>
                </div>
              </div>
              <PriceFormatter amount={q.price} className="font-semibold" />
            </div>
          ))}
        </RadioGroup>
      )}

      {showSelectedOnly && (
        <div className="rounded-lg border border-shop_dark_green bg-shop_dark_green/5 p-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-5 rounded-full border-2 border-shop_dark_green bg-shop_dark_green shrink-0">
              <Check className="h-3 w-3 text-white" />
            </div>
            <div className="grid gap-1">
              <span className="font-medium">{selectedShipping.service}</span>
              <span className="text-sm text-muted-foreground">
                {selectedShipping.deliveryDays} dias úteis
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <PriceFormatter
              amount={selectedShipping.price}
              className="font-semibold"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Recalcule para alterar o frete
          </p>
        </div>
      )}
    </div>
  );
}
