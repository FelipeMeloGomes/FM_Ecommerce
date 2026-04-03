import type { Category } from "@/sanity.types";
import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
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
        {categories?.map((category) => (
          <div key={category._id} className="flex items-center gap-2">
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="rounded"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={
                selectedCategory === category?.slug?.current
                  ? "font-semibold text-shop_dark_green cursor-pointer"
                  : "text-muted-foreground cursor-pointer"
              }
            >
              {category?.title}
            </Label>
          </div>
        ))}
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
