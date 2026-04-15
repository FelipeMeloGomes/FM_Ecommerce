import { beforeEach, describe, expect, it } from "vitest";
import useStore from "../../store";
import { makeProduct, makeShipping } from "../factories/entityFactories";

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ items: [], shipping: null, favoriteProduct: [] });
});

describe("store — itens do carrinho", () => {
  it("adiciona item ao carrinho", () => {
    const { addItem, getItemCount } = useStore.getState();
    addItem(makeProduct());

    expect(getItemCount("p1")).toBe(1);
  });

  it("incrementa quantidade ao adicionar item existente", () => {
    const { addItem, getItemCount } = useStore.getState();
    addItem(makeProduct());
    addItem(makeProduct());

    expect(getItemCount("p1")).toBe(2);
  });

  it("deleta produto do carrinho", () => {
    const { addItem, deleteCartProduct, getItemCount } = useStore.getState();
    addItem(makeProduct());
    deleteCartProduct("p1");

    expect(getItemCount("p1")).toBe(0);
  });

  it("limpa todos os itens", () => {
    const { addItem, resetCart, getItemCount } = useStore.getState();
    addItem(makeProduct());
    addItem(makeProduct({ _id: "p2" } as never));
    resetCart();

    expect(getItemCount("p1")).toBe(0);
    expect(getItemCount("p2")).toBe(0);
  });
});

describe("store — preços", () => {
  it("calcula total padrão (soma dos preços)", () => {
    const { addItem, getTotalPrice } = useStore.getState();
    addItem(makeProduct({ _id: "p1", price: 80 }));
    addItem(makeProduct({ _id: "p2", price: 20 }));

    expect(getTotalPrice()).toBe(100);
  });

  it("calcula total incluindo frete", () => {
    const { addItem, setShipping, getTotalPrice } = useStore.getState();
    const shipping = makeShipping();
    addItem(makeProduct({ _id: "p1", price: 80 }));
    addItem(makeProduct({ _id: "p2", price: 20 }));
    setShipping(shipping);

    expect(getTotalPrice()).toBe(80 + 20 + shipping.price);
  });

  it("calcula subtotal com desconto", () => {
    // lógica: discountedPrice = price + (discount * price) / 100
    // price 100, discount 10 => 100 + 10 = 110
    const { addItem, getSubTotalPrice } = useStore.getState();
    addItem(makeProduct({ price: 100, discount: 10 }));

    expect(getSubTotalPrice()).toBe(110);
  });

  it("subtotal ignora desconto quando não existe", () => {
    const { addItem, getSubTotalPrice } = useStore.getState();
    addItem(makeProduct({ price: 100, discount: 0 }));

    expect(getSubTotalPrice()).toBe(100);
  });
});
