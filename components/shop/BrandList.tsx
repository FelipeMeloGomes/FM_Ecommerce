import type React from "react";
import type { BRANDS_QUERY_RESULT } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  brands: BRANDS_QUERY_RESULT;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Marcas</Title>
      <RadioGroup
        value={selectedBrand || ""}
        onValueChange={(value) => setSelectedBrand(value || null)}
        className="mt-2 space-y-1"
      >
        {brands?.map((brand) => (
          <div key={brand._id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={brand?.slug?.current as string}
              id={brand?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand?.slug?.current}
              className={
                selectedBrand === brand?.slug?.current
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }
            >
              {brand?.title}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button
            type="button"
            onClick={() => setSelectedBrand(null)}
            className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green transition text-left"
          >
            Redefinir seleção
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
