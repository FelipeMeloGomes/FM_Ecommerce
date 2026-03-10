import { describe, expect, it } from "vitest";
import { checkoutSchema } from "../../../lib/schemas/checkoutSchema";

describe("checkoutSchema", () => {
  const validCheckout = {
    selectedAddress: {
      name: "Casa",
      address: "Rua Teste, 123",
      city: "São Paulo",
      state: "SP",
      zip: "01234-567",
      default: true,
    },
    selectedShipping: {
      service: "PAC",
      price: 20.5,
    },
  };

  it("deve validar checkout válido", () => {
    const result = checkoutSchema.safeParse(validCheckout);
    expect(result.success).toBe(true);
  });

  it("deve falhar quando selectedAddress está ausente", () => {
    const result = checkoutSchema.safeParse({
      selectedAddress: undefined,
      selectedShipping: {
        service: "PAC",
        price: 20,
      },
    });
    expect(result.success).toBe(false);
  });

  it("deve falhar quando selectedShipping está ausente", () => {
    const result = checkoutSchema.safeParse({
      selectedAddress: {
        name: "Casa",
        address: "Rua Teste",
        city: "São Paulo",
        state: "SP",
        zip: "01234-567",
      },
      selectedShipping: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("deve falhar quando service está vazio", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      selectedShipping: {
        service: "",
        price: 20,
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Serviço de entrega é obrigatório",
    );
  });

  it("deve falhar quando price é negativo", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      selectedShipping: {
        service: "PAC",
        price: -10,
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Preço do frete deve ser positivo",
    );
  });

  it("deve falhar quando price é zero", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      selectedShipping: {
        service: "PAC",
        price: 0,
      },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Preço do frete deve ser positivo",
    );
  });

  it("deve falhar quando selectedAddress tem campos inválidos", () => {
    const result = checkoutSchema.safeParse({
      selectedAddress: {
        name: "",
        address: "",
        city: "",
        state: "X",
        zip: "invalid",
      },
      selectedShipping: validCheckout.selectedShipping,
    });
    expect(result.success).toBe(false);
  });
});
