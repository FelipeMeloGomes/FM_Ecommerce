import { beforeEach, describe, expect, it } from "vitest";
import useStore from "../../store";
import { makeProduct, makeShipping } from "../factories/entityFactories";

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ items: [], shipping: null, favoriteProduct: [] });
});

describe("store", () => {
  it("adiciona item e incrementa quantidade", () => {
    const { addItem, getItemCount } = useStore.getState();
    addItem(makeProduct());
    addItem(makeProduct());
    expect(getItemCount("p1")).toBe(2);
  });

  it("calcula total incluindo frete", () => {
    const { addItem, setShipping, getTotalPrice } = useStore.getState();
    const shipping = makeShipping();
    addItem(makeProduct({ _id: "p1", price: 80 }));
    addItem(makeProduct({ _id: "p2", price: 20 }));
    setShipping(shipping);
    expect(getTotalPrice()).toBe(80 + 20 + shipping.price);
  });

  it("calcula subtotal com lógica de desconto do projeto", () => {
    // lógica atual: discountedPrice = price + (discount * price) / 100
    // price 100, discount 10 => 110
    const { addItem, getSubTotalPrice } = useStore.getState();
    addItem(makeProduct({ price: 100, discount: 10 }));
    expect(getSubTotalPrice()).toBe(110);
  });
});
