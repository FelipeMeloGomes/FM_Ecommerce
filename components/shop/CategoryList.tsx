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
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Product Categories</Title>

      <RadioGroup
        value={selectedCategory || ""}
        onValueChange={(value) => setSelectedCategory(value || null)}
        className="mt-2 space-y-1"
      >
        {categories?.map((category) => (
          <div key={category._id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={
                selectedCategory === category?.slug?.current
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
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
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect text-left"
        >
          Redefinir seleção
        </button>
      )}
    </div>
  );
};

export default CategoryList;
