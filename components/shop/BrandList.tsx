import type { BRANDS_QUERYResult } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: (value: string | null) => void;
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
        {brands?.map((brand) => {
          const slug = brand?.slug?.current as string;
          const isSelected = selectedBrand === slug;
          return (
            <div
              key={brand._id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSelectedBrand(slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedBrand(slug);
                }
              }}
            >
              <RadioGroupItem value={slug} id={slug} className="rounded" />
              <Label
                htmlFor={slug}
                className={
                  isSelected
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
