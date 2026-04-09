import React, { useCallback } from "react";
import { useFilterSelection } from "@/hooks/use-filter-selection";
import type { Category } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: (value: string | null) => void;
}

const CategoryList = React.memo(
  ({ categories, selectedCategory, setSelectedCategory }: Props) => {
    const { select, clear, isSelected } = useFilterSelection({
      initialValue: selectedCategory,
    });

    const handleSelect = useCallback(
      (value: string) => {
        select(value);
        setSelectedCategory(value);
      },
      [select, setSelectedCategory],
    );

    const handleClear = useCallback(() => {
      clear();
      setSelectedCategory(null);
    }, [clear, setSelectedCategory]);

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
        <Title className="text-base font-bold">Categorias</Title>

        <RadioGroup
          value={selectedCategory || ""}
          onValueChange={handleSelect}
          className="mt-3 space-y-2"
        >
          {categories?.map((category) => {
            const slug = category?.slug?.current as string;
            const checked = isSelected(slug);
            return (
              <div
                key={category._id}
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
                  {category?.title}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        {selectedCategory && (
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

CategoryList.displayName = "CategoryList";

export default CategoryList;
