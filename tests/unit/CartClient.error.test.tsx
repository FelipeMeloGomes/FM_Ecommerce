import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useStore from "../../store";
import {
  makeAddress,
  makeProduct,
  makeShipping,
} from "../factories/entityFactories";

vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ isSignedIn: true }),
  useUser: () => ({
    user: {
      fullName: "John Tester",
      emailAddresses: [{ emailAddress: "john@example.com" }],
      id: "user-1",
    },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: vi.fn(() => "/cart"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// UI component mocks
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
    setTimeout(() => props.onCheckout(), 0);
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

beforeEach(() => {
  useStore.setState({ items: [], shipping: null, favoriteProduct: [] }, false);
  // @ts-expect-error override for test
  delete window.location;
  // @ts-expect-error override for test
  window.location = { href: "" };
});

describe("CartClient — tratamento de erro no checkout", () => {
  it("exibe toast de erro e não redireciona quando checkout falha", async () => {
    const { default: toast } = await import("react-hot-toast");
    const { default: CartClient } = await import(
      "@/app/(client)/cart/CartClient"
    );
    const { addItem, setShipping } = useStore.getState();

    addItem(makeProduct({ _id: "p1", price: 80 }));
    setShipping(makeShipping());

    const container = document.createElement("div");
    const root = createRoot(container);
    root.render(<CartClient addresses={[makeAddress()]} />);

    // Aguarda dois ciclos de micro-tarefas (montagem + setTimeout do mock)
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
