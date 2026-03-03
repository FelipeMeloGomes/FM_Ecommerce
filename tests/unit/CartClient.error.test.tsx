import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Address, Product } from "../../sanity.types";
import useStore from "../../store";

vi.mock("@clerk/nextjs", () => {
  return {
    useAuth: () => ({ isSignedIn: true }),
    useUser: () => ({
      user: {
        fullName: "John Tester",
        emailAddresses: [{ emailAddress: "john@example.com" }],
        id: "user-1",
      },
    }),
  };
});

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
vi.mock("@/components/cart/OrderSummary", () => ({
  default: (props: { onCheckout: () => void }) => {
    // dispara checkout após efeitos de montagem
    setTimeout(() => {
      props.onCheckout();
    }, 0);
    return null;
  },
}));

vi.mock("@/app/(client)/cart/checkoutLogic", () => ({
  performCheckout: vi.fn(async () => {
    throw new Error("Erro ao criar sessão");
  }),
}));
vi.mock("@/actions/createCheckoutSession", () => ({
  createCheckoutSession: vi.fn(),
}));

vi.mock("@/actions/deleteAddress", () => ({
  deleteAddress: vi.fn(async () => {}),
}));

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn(), success: vi.fn() },
  error: vi.fn(),
  success: vi.fn(),
}));

const addressDefault: Address = {
  _id: "addr-1",
  _type: "address",
  _createdAt: "",
  _updatedAt: "",
  _rev: "",
  name: "Casa",
  address: "Rua Teste, 123",
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
    price: 50,
    ...overrides,
  }) as Product;

beforeEach(() => {
  useStore.setState(
    {
      items: [],
      shipping: null,
      favoriteProduct: [],
    },
    false,
  );
  // reset window location
  // @ts-expect-error override for test
  delete window.location;
  // @ts-expect-error override for test
  window.location = { href: "" };
});

describe("CartClient - tratamento de erro no checkout", () => {
  it("exibe toast de erro e não redireciona quando createCheckoutSession falha", async () => {
    const toastMod = await import("react-hot-toast");
    const toast = toastMod.default;
    const { default: CartClient } = await import(
      "@/app/(client)/cart/CartClient"
    );
    const { addItem, setShipping } = useStore.getState();
    addItem(product({ _id: "p1", price: 80 }));
    setShipping({ service: "PAC", price: 20.5, deliveryDays: 6 });

    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(<CartClient addresses={[addressDefault]} />);

    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0));
    const { performCheckout } = await import(
      "@/app/(client)/cart/checkoutLogic"
    );
    expect(performCheckout).toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith("Erro ao criar sessão");
    expect(window.location.href).toBe("");
  });
});
