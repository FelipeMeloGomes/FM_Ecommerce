import { describe, expect, it, vi } from "vitest";
import { performCheckout } from "../../app/(client)/cart/checkoutLogic";
import type { Address, Product } from "../../sanity.types";

const address: Address = {
  _id: "a1",
  _type: "address",
  _createdAt: "",
  _updatedAt: "",
  _rev: "",
  name: "Casa",
  address: "Rua 1",
  city: "Cidade",
  state: "ST",
  zip: "12345-678",
  default: true,
  createdAt: "",
};

const product = (overrides: Partial<Product> = {}): Product =>
  ({
    _id: "p1",
    name: "Produto Teste",
    price: 100,
    ...overrides,
  }) as Product;

describe("checkoutLogic.performCheckout", () => {
  it("erro quando endereço não selecionado", async () => {
    const deps = {
      createCheckoutSession: vi.fn(async () => "url"),
    };
    await expect(
      performCheckout(
        [{ product: product(), quantity: 1 }],
        { fullName: "John", emailAddresses: [{ emailAddress: "john@e.com" }] },
        null,
        { service: "PAC", price: 10 },
        deps,
      ),
    ).rejects.toThrow("Selecione um endereço de entrega");
    expect(deps.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("erro quando frete não selecionado", async () => {
    const deps = {
      createCheckoutSession: vi.fn(async () => "url"),
    };
    await expect(
      performCheckout(
        [{ product: product(), quantity: 1 }],
        { fullName: "John", emailAddresses: [{ emailAddress: "john@e.com" }] },
        address,
        null,
        deps,
      ),
    ).rejects.toThrow("Selecione uma opção de frete");
    expect(deps.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("sucesso retorna URL e chama createCheckoutSession", async () => {
    const deps = {
      createCheckoutSession: vi.fn(async () => "https://checkout.example/ok"),
    };
    const url = await performCheckout(
      [{ product: product(), quantity: 2 }],
      {
        fullName: "John",
        emailAddresses: [{ emailAddress: "john@e.com" }],
        id: "user-1",
      },
      address,
      { service: "SEDEX", price: 29.9 },
      deps,
    );
    expect(url).toBe("https://checkout.example/ok");
    expect(deps.createCheckoutSession).toHaveBeenCalledTimes(1);
    const args = deps.createCheckoutSession.mock.calls[0];
    expect(args[0]).toHaveLength(1);
    expect(args[2]).toEqual({ service: "SEDEX", price: 29.9 });
  });

  it("falha quando createCheckoutSession lança erro e não retorna URL", async () => {
    const deps = {
      createCheckoutSession: vi.fn(async () => {
        throw new Error("Falhou no gateway");
      }),
    };
    await expect(
      performCheckout(
        [{ product: product(), quantity: 1 }],
        { fullName: "John", emailAddresses: [{ emailAddress: "john@e.com" }] },
        address,
        { service: "PAC", price: 10 },
        deps,
      ),
    ).rejects.toThrow("Falhou no gateway");
    expect(deps.createCheckoutSession).toHaveBeenCalledTimes(1);
  });
});
