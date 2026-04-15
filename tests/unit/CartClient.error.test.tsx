import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  ClerkUser,
  ShippingItem,
} from "@/app/(client)/cart/checkoutLogic";
import { performCheckout } from "@/app/(client)/cart/checkoutLogic";
import { makeAddress, makeProduct } from "../factories/entityFactories";

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ isSignedIn: true }),
  useUser: () => ({
    fullName: "John Tester",
    emailAddresses: [{ emailAddress: "john@example.com" }],
    id: "user-1",
  }),
}));

vi.mock("@/components/Container", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/Title", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/cart/CartItemsList", () => ({ default: () => null }));
vi.mock("@/components/cart/AddressSection", () => ({ default: () => null }));
vi.mock("@/components/cart/MobileOrderSummary", () => ({
  default: () => null,
}));
vi.mock("@/components/EmptyCart", () => ({ default: () => null }));
vi.mock("@/components/ShippingCalculator", () => ({
  ShippingCalculator: () => null,
}));
vi.mock("@/components/cart/OrderSummary", () => ({ default: () => null }));
vi.mock("@/actions/createCheckoutSession", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue("https://checkout.url"),
}));
vi.mock("@/actions/deleteAddress", () => ({ deleteAddress: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

describe("performCheckout — validação de erros", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lança erro quando endereço não selecionado", async () => {
    const items = [
      { product: makeProduct({ _id: "p1", price: 80 }), quantity: 1 },
    ];
    const user: ClerkUser = { fullName: "John Tester", id: "user-1" };
    const shipping: ShippingItem = {
      service: "PAC",
      price: 20,
      deliveryDays: 5,
    };
    const deps = {
      createCheckoutSession: vi.fn(async () => "https://checkout.url"),
    };

    await expect(
      performCheckout(items, user, null, shipping, deps),
    ).rejects.toThrow("Selecione um endereço de entrega");
  });

  it("lança erro quando frete não selecionado", async () => {
    const items = [
      { product: makeProduct({ _id: "p1", price: 80 }), quantity: 1 },
    ];
    const user: ClerkUser = { fullName: "John Tester", id: "user-1" };
    const address = makeAddress({ _id: "addr-1" });
    const deps = {
      createCheckoutSession: vi.fn(async () => "https://checkout.url"),
    };

    await expect(
      performCheckout(items, user, address, null, deps),
    ).rejects.toThrow("Selecione uma opção de frete");
  });

  it("retorna URL quando dados válidos", async () => {
    const items = [
      { product: makeProduct({ _id: "p1", price: 80 }), quantity: 1 },
    ];
    const user: ClerkUser = { fullName: "John Tester", id: "user-1" };
    const address = makeAddress({ _id: "addr-1" });
    const shipping: ShippingItem = {
      service: "PAC",
      price: 20,
      deliveryDays: 5,
    };
    const deps = {
      createCheckoutSession: vi.fn(async () => "https://checkout.url"),
    };

    const url = await performCheckout(items, user, address, shipping, deps);

    expect(url).toBe("https://checkout.url");
    expect(deps.createCheckoutSession).toHaveBeenCalledTimes(1);
  });

  it("chama createCheckoutSession com dados corretos", async () => {
    const items = [
      { product: makeProduct({ _id: "p1", price: 80 }), quantity: 1 },
    ];
    const user: ClerkUser = { fullName: "John Tester", id: "user-1" };
    const address = makeAddress({ _id: "addr-1" });
    const shipping: ShippingItem = {
      service: "PAC",
      price: 20,
      deliveryDays: 5,
    };
    const deps = {
      createCheckoutSession: vi.fn(async () => "https://checkout.url"),
    };

    await performCheckout(items, user, address, shipping, deps);

    expect(deps.createCheckoutSession).toHaveBeenCalledWith(
      items,
      expect.objectContaining({
        orderNumber: expect.any(String),
        customerName: "John Tester",
        shipping: { method: "PAC", price: 20, estimatedDays: 5 },
      }),
    );
  });
});
