import { describe, expect, it, vi } from "vitest";
import {
  type CheckoutDeps,
  performCheckout,
} from "../../app/(client)/cart/checkoutLogic";
import {
  makeAddress,
  makeCartItem,
  makeProduct,
  makeShipping,
} from "../factories/entityFactories";

const makeUser = (overrides = {}) => ({
  fullName: "John",
  emailAddresses: [{ emailAddress: "john@e.com" }],
  id: "user-1",
  ...overrides,
});

const makeDeps = (url = "https://checkout.example/ok"): CheckoutDeps => ({
  createCheckoutSession: vi.fn(async () => url),
});

describe("checkoutLogic.performCheckout", () => {
  it("lança erro quando endereço não selecionado", async () => {
    const deps = makeDeps();
    await expect(
      performCheckout([makeCartItem()], makeUser(), null, makeShipping(), deps),
    ).rejects.toThrow("Selecione um endereço de entrega");
    expect(deps.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("lança erro quando frete não selecionado", async () => {
    const deps = makeDeps();
    await expect(
      performCheckout([makeCartItem()], makeUser(), makeAddress(), null, deps),
    ).rejects.toThrow("Selecione uma opção de frete");
    expect(deps.createCheckoutSession).not.toHaveBeenCalled();
  });

  it("retorna URL e chama createCheckoutSession com metadata completa", async () => {
    const deps = makeDeps("https://checkout.example/ok");
    const address = makeAddress();
    const shipping = makeShipping({
      service: "SEDEX",
      price: 29.9,
      deliveryDays: 2,
    });

    const url = await performCheckout(
      [makeCartItem({ product: makeProduct(), quantity: 2 })],
      makeUser(),
      address,
      shipping,
      deps,
    );

    expect(url).toBe("https://checkout.example/ok");
    expect(deps.createCheckoutSession).toHaveBeenCalledTimes(1);

    const [itemsArg, metadataArg] = vi.mocked(deps.createCheckoutSession).mock
      .calls[0];
    expect(itemsArg).toHaveLength(1);
    expect(metadataArg.customerName).toBe("John");
    expect(metadataArg.customerEmail).toBe("john@e.com");
    expect(metadataArg.address).toEqual(address);
    expect(metadataArg.shipping).toEqual({
      method: "SEDEX",
      price: 29.9,
      estimatedDays: 2,
    });
  });

  it("usa 'Unknown' para nome e email quando user é null", async () => {
    const deps = makeDeps();

    await performCheckout(
      [makeCartItem()],
      null,
      makeAddress(),
      makeShipping(),
      deps,
    );

    const [, metadataArg] = vi.mocked(deps.createCheckoutSession).mock.calls[0];
    expect(metadataArg.customerName).toBe("Unknown");
    expect(metadataArg.customerEmail).toBe("Unknown");
  });

  it("propaga erro quando createCheckoutSession lança exceção", async () => {
    const deps: CheckoutDeps = {
      createCheckoutSession: vi.fn(async () => {
        throw new Error("Falhou no gateway");
      }),
    };
    await expect(
      performCheckout(
        [makeCartItem()],
        makeUser(),
        makeAddress(),
        makeShipping(),
        deps,
      ),
    ).rejects.toThrow("Falhou no gateway");
    expect(deps.createCheckoutSession).toHaveBeenCalledTimes(1);
  });
});
