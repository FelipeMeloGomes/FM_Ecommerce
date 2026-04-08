import type React from "react";
import type { BRANDS_QUERYResult } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-card border border-border/60 p-5 rounded-xl">
      <Title className="text-base font-bold">Marcas</Title>
      <RadioGroup
        value={selectedBrand || ""}
        onValueChange={(value) => setSelectedBrand(value || null)}
        className="mt-3 space-y-2"
      >
        {brands?.map((brand) => (
          <div key={brand._id} className="flex items-center gap-2">
            <RadioGroupItem
              value={brand?.slug?.current as string}
              id={brand?.slug?.current}
              className="rounded"
            />
            <Label
              htmlFor={brand?.slug?.current}
              className={
                selectedBrand === brand?.slug?.current
                  ? "font-semibold text-shop_dark_green cursor-pointer"
                  : "text-muted-foreground cursor-pointer"
              }
            >
              {brand?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedBrand && (
        <button
          type="button"
          onClick={() => setSelectedBrand(null)}
          className="text-sm font-medium mt-3 text-shop_orange hover:text-shop_btn_dark_green transition-colors"
        >
          Redefinir seleção
        </button>
      )}
    </div>
  );
};

export default BrandList;
