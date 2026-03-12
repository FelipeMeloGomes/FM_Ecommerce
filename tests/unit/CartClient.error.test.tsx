import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type CartClientType from "@/app/(client)/cart/CartClient";
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

vi.mock("@/components/Container", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/Title", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/cart/CartItemsList", () => ({ default: () => null }));

vi.mock("@/components/cart/AddressSection", () => ({
  default: ({
    addresses,
    onSelectAddress: _onSelectAddress,
    onDeleteAddress: _onDeleteAddress,
  }: {
    addresses: unknown[];
    onSelectAddress: (id: string) => void;
    onDeleteAddress: (id: string) => void;
  }) => {
    if (!addresses || addresses.length === 0) {
      return (
        <div data-testid="address-section">
          <p>Você ainda não possui um endereço cadastrado.</p>
          <a href="/account/addresses" data-testid="add-address-link">
            Cadastrar Endereço
          </a>
        </div>
      );
    }
    return <div data-testid="address-section">Address List</div>;
  },
}));

vi.mock("@/components/cart/MobileOrderSummary", () => ({
  default: () => null,
}));
vi.mock("@/components/EmptyCart", () => ({ default: () => null }));
vi.mock("@/components/ShippingCalculator", () => ({
  ShippingCalculator: () => null,
}));

vi.mock("@/components/cart/OrderSummary", () => ({
  default: (props: {
    onCheckout: () => void;
    selectedAddressId?: string | null;
  }) => {
    if (props.selectedAddressId) {
      setTimeout(() => props.onCheckout(), 0);
    }
    return null;
  },
}));

const mockPerformCheckout = vi.fn(async () => {
  throw new Error("Erro ao criar sessão");
});

vi.mock("@/app/(client)/cart/checkoutLogic", () => ({
  performCheckout: mockPerformCheckout,
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

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let CartClient: typeof CartClientType;

beforeEach(async () => {
  useStore.setState({ items: [], shipping: null, favoriteProduct: [] }, false);
  vi.resetAllMocks();

  // biome-ignore lint/suspicious/noExplicitAny: test setup
  delete (window as any).location;
  // biome-ignore lint/suspicious/noExplicitAny: test setup
  (window as any).location = { href: "" };

  mockPerformCheckout.mockImplementation(async () => {
    throw new Error("Erro ao criar sessão");
  });

  const { addItem, setShipping } = useStore.getState();
  addItem(makeProduct({ _id: "p1", price: 80 }));
  setShipping(makeShipping());

  const module = await import("@/app/(client)/cart/CartClient");
  CartClient = module.default;

  container = document.createElement("div");
  root = createRoot(container);
});

afterEach(() => {
  root.unmount();
  container.remove();
});

describe("CartClient — tratamento de erro no checkout", () => {
  it("exibe toast de erro e não redireciona quando checkout falha", async () => {
    const { default: toast } = await import("react-hot-toast");
    const { performCheckout } = await import(
      "@/app/(client)/cart/checkoutLogic"
    );

    await new Promise<void>((resolve) => {
      root.render(<CartClient addresses={[makeAddress()]} />);
      setTimeout(resolve, 0);
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    expect(performCheckout).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Erro ao criar sessão");
    // biome-ignore lint/suspicious/noExplicitAny: test assertion
    expect((window as any).location.href).toBe("");
  });
});

describe("CartClient — sem endereços cadastrados", () => {
  beforeEach(() => {
    mockPerformCheckout.mockReset();
  });

  it("renderiza mensagem e link quando addresses é array vazio", async () => {
    await new Promise<void>((resolve) => {
      root.render(<CartClient addresses={[]} />);
      setTimeout(resolve, 0);
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    const addressSection = container.querySelector(
      "[data-testid='address-section']",
    );
    expect(addressSection).not.toBeNull();
    expect(addressSection?.textContent).toContain(
      "Você ainda não possui um endereço cadastrado",
    );

    const link = container.querySelector("[data-testid='add-address-link']");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/account/addresses");
  });
});
