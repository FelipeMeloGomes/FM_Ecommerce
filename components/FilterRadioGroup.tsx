import React, { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterSelection } from "@/hooks/use-filter-selection";

interface FilterItem {
  value: string;
  label: string;
}

interface FilterRadioGroupProps {
  title: string;
  items: FilterItem[];
  className?: string;
}

const FilterRadioGroup = React.memo(
  ({ title, items, className }: FilterRadioGroupProps) => {
    const { selected, select, clear, isSelected } = useFilterSelection();

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, value: string) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(value);
        }
      },
      [select],
    );

    return (
      <div
        className={`w-full bg-card border border-border/60 p-5 rounded-xl ${className ?? ""}`}
      >
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <RadioGroup
          value={selected || ""}
          onValueChange={select}
          className="mt-3 space-y-2"
        >
          {items?.map((item) => {
            const checked = isSelected(item.value);
            return (
              <div
                key={item.value}
                role="radio"
                aria-checked={checked}
                tabIndex={0}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => select(item.value)}
                onKeyDown={(e) => handleKeyDown(e, item.value)}
              >
                <RadioGroupItem
                  value={item.value}
                  id={item.value}
                  className="rounded"
                />
                <Label
                  htmlFor={item.value}
                  className={
                    checked
                      ? "font-semibold text-shop_dark_green cursor-pointer"
                      : "text-muted-foreground cursor-pointer"
                  }
                >
                  {item.label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        {selected && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium mt-3 text-shop_orange hover:text-shop_btn_dark_green transition-colors"
          >
            Redefinir seleção
          </button>
        )}
      </div>
    );
  },
);

FilterRadioGroup.displayName = "FilterRadioGroup";

export { FilterRadioGroup };
