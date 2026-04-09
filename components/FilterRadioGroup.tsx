import React, { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FilterItem {
  value: string;
  label: string;
}

interface FilterRadioGroupProps {
  title: string;
  items: FilterItem[];
  selected: string | null;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

const FilterRadioGroup = React.memo(
  ({
    title,
    items,
    selected,
    onChange,
    onClear,
    className,
  }: FilterRadioGroupProps) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, value: string) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(value);
        }
      },
      [onChange],
    );

    return (
      <div
        className={`w-full bg-card border border-border/60 p-5 rounded-xl ${className ?? ""}`}
      >
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <RadioGroup
          value={selected || ""}
          onValueChange={onChange}
          className="mt-3 space-y-2"
        >
          {items?.map((item) => {
            const checked = selected === item.value;
            return (
              <div
                key={item.value}
                role="radio"
                aria-checked={checked}
                tabIndex={0}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onChange(item.value)}
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
        {selected && onClear && (
          <button
            type="button"
            onClick={onClear}
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
export type { FilterItem };
