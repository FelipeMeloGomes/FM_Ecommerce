import React, { useCallback } from "react";
import { useFilterSelection } from "@/hooks/use-filter-selection";
import type { BRANDS_QUERYResult } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: (value: string | null) => void;
}

const BrandList = React.memo(
  ({ brands, selectedBrand, setSelectedBrand }: Props) => {
    const { select, clear, isSelected } = useFilterSelection({
      initialValue: selectedBrand,
    });

    const handleSelect = useCallback(
      (value: string) => {
        select(value);
        setSelectedBrand(value);
      },
      [select, setSelectedBrand],
    );

    const handleClear = useCallback(() => {
      clear();
      setSelectedBrand(null);
    }, [clear, setSelectedBrand]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, value: string) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect(value);
        }
      },
      [handleSelect],
    );

    return (
      <div className="w-full bg-card border border-border/60 p-5 rounded-xl">
        <Title className="text-base font-bold">Marcas</Title>
        <RadioGroup
          value={selectedBrand || ""}
          onValueChange={handleSelect}
          className="mt-3 space-y-2"
        >
          {brands?.map((brand) => {
            const slug = brand?.slug?.current as string;
            const checked = isSelected(slug);
            return (
              <div
                key={brand._id}
                role="radio"
                aria-checked={checked}
                tabIndex={0}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => handleSelect(slug)}
                onKeyDown={(e) => handleKeyDown(e, slug)}
              >
                <RadioGroupItem value={slug} id={slug} className="rounded" />
                <Label
                  htmlFor={slug}
                  className={
                    checked
                      ? "font-semibold text-shop_dark_green cursor-pointer"
                      : "text-muted-foreground cursor-pointer"
                  }
                >
                  {brand?.title}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        {selectedBrand && (
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
  },
);

BrandList.displayName = "BrandList";

export default BrandList;
