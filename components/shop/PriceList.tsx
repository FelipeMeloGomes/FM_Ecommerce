import Title from "../Title";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const priceArray = [
  { title: "Under $100", value: "0-100" },
  { title: "$100 - $200", value: "100-200" },
  { title: "$200 - $300", value: "200-300" },
  { title: "$300 - $500", value: "300-500" },
  { title: "Over $500", value: "500-10000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Price</Title>
      <RadioGroup
        className="mt-2 space-y-1"
        value={selectedPrice || ""}
        onValueChange={(value) => setSelectedPrice(value || null)}
      >
        {priceArray?.map((price) => (
          <div key={price.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={price.value}
              id={price.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={
                selectedPrice === price.value
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }
            >
              {price.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          type="button"
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect"
        >
          Redefinir seleção
        </button>
      )}
    </div>
  );
};

export default PriceList;
