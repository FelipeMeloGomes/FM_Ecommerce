import React, { useCallback } from "react";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const priceArray = [
  { title: "Até R$ 100", value: "0-100" },
  { title: "R$ 100 - R$ 200", value: "100-200" },
  { title: "R$ 200 - R$ 300", value: "200-300" },
  { title: "R$ 300 - R$ 500", value: "300-500" },
  { title: "Acima de R$ 500", value: "500-10000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: (value: string | null) => void;
}

const PriceList = React.memo(({ selectedPrice, setSelectedPrice }: Props) => {
  const handleSelect = useCallback(
    (value: string) => {
      setSelectedPrice(value);
    },
    [setSelectedPrice],
  );

  const handleClear = useCallback(() => {
    setSelectedPrice(null);
  }, [setSelectedPrice]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, value: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedPrice(value);
      }
    },
    [setSelectedPrice],
  );

  return (
    <div className="w-full bg-card border border-border/60 p-5 rounded-xl">
      <Title className="text-base font-bold">Preço</Title>
      <RadioGroup
        className="mt-3 space-y-2"
        value={selectedPrice || ""}
        onValueChange={(value) => handleSelect(value)}
      >
        {priceArray?.map((price) => {
          const isSelected = selectedPrice === price.value;
          return (
            <div
              key={price.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleSelect(price.value)}
              onKeyDown={(e) => handleKeyDown(e, price.value)}
            >
              <RadioGroupItem
                value={price.value}
                id={price.value}
                className="rounded"
              />
              <Label
                htmlFor={price.value}
                className={
                  isSelected
                    ? "font-semibold text-shop_dark_green cursor-pointer"
                    : "text-muted-foreground cursor-pointer"
                }
              >
                {price.title}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {selectedPrice && (
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium mt-3 text-shop_orange hover:text-shop_btn_dark_green transition-colors"
        >
          Redefinir seleção
        </button>
      )}
    </div>
  );
});

PriceList.displayName = "PriceList";

export default PriceList;
