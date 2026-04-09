import type { Category } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: (value: string | null) => void;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-card border border-border/60 p-5 rounded-xl">
      <Title className="text-base font-bold">Categorias</Title>

      <RadioGroup
        value={selectedCategory || ""}
        onValueChange={(value) => setSelectedCategory(value || null)}
        className="mt-3 space-y-2"
      >
        {categories?.map((category) => {
          const slug = category?.slug?.current as string;
          const isSelected = selectedCategory === slug;
          return (
            <div
              key={category._id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setSelectedCategory(slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedCategory(slug);
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
                {category?.title}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {selectedCategory && (
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-3 text-shop_orange hover:text-shop_btn_dark_green transition-colors"
        >
          Redefinir seleção
        </button>
      )}
    </div>
  );
};

export default CategoryList;
