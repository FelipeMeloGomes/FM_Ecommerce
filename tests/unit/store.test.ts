import { beforeEach, describe, expect, it } from "vitest";
import type { ShippingQuote } from "../../core/shipping/ShippingQuote";
import type { Product } from "../../sanity.types";
import useStore from "../../store";

const product = (overrides: Partial<Product> = {}): Product =>
  ({
    _id: "p1",
    name: "Produto Teste",
    price: 100,
    discount: 10,
    ...overrides,
  }) as Product;

const shipping: ShippingQuote = {
  service: "PAC",
  price: 25.9,
  deliveryDays: 5,
};

beforeEach(() => {
  localStorage.clear();
  useStore.setState({
    items: [],
    shipping: null,
    favoriteProduct: [],
  });
});

describe("store", () => {
  it("adiciona item e incrementa quantidade", () => {
    const { addItem, getItemCount } = useStore.getState();
    addItem(product());
    addItem(product());
    expect(getItemCount("p1")).toBe(2);
  });

  it("calcula total incluindo frete", () => {
    const { addItem, setShipping, getTotalPrice } = useStore.getState();
    addItem(product({ _id: "p1", price: 80 }));
    addItem(product({ _id: "p2", price: 20 }));
    setShipping(shipping);
    expect(getTotalPrice()).toBe(80 + 20 + shipping.price);
  });

  it("calcula subtotal com lógica de desconto do projeto", () => {
    const { addItem, getSubTotalPrice } = useStore.getState();
    // lógica atual: discountedPrice = price + (discount*price)/100
    // price 100, discount 10 => 110
    addItem(product({ price: 100, discount: 10 }));
    expect(getSubTotalPrice()).toBe(110);
  });
});
