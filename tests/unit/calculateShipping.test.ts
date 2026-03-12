import { describe, expect, it, vi } from "vitest";
import { calculateShipping } from "../../actions/calculateShipping";
import type { ShippingQuote } from "../../core/shipping/ShippingQuote";

vi.mock("../../config/shippingGateway", () => {
  return {
    shippingGateway: {
      calculate: vi.fn(async (_zip: string, _items: unknown[]) => {
        const quotes: ShippingQuote[] = [
          { service: "PAC", price: 20.5, deliveryDays: 6 },
          { service: "SEDEX", price: 35.9, deliveryDays: 2 },
        ];
        return quotes;
      }),
    },
  };
});

const makeItems = () => [
  { weight: 1, width: 10, height: 5, length: 20, quantity: 2 },
  { weight: 0.5, width: 5, height: 5, length: 10, quantity: 1 },
];

describe("calculateShipping action", () => {
  describe("caminho feliz", () => {
    it("retorna cotações com contrato completo", async () => {
      const quotes = await calculateShipping("12345-678", makeItems());

      expect(quotes).toHaveLength(2);
      expect(quotes[0]).toEqual({
        service: "PAC",
        price: 20.5,
        deliveryDays: 6,
      });
      expect(quotes[1]).toEqual({
        service: "SEDEX",
        price: 35.9,
        deliveryDays: 2,
      });
    });

    it("aceita CEP sem máscara", async () => {
      const quotes = await calculateShipping("12345678", makeItems());

      expect(quotes).toHaveLength(2);
    });
  });

  describe("validação de CEP", () => {
    it("lança erro para CEP inválido", async () => {
      await expect(
        calculateShipping("cep-errado", makeItems()),
      ).rejects.toThrow("CEP inválido");
    });

    it("lança erro para CEP vazio", async () => {
      await expect(calculateShipping("", makeItems())).rejects.toThrow(
        "CEP inválido (formato: 00000-000)",
      );
    });
  });

  describe("validação de itens", () => {
    it("lança erro para array de itens vazio", async () => {
      await expect(calculateShipping("12345-678", [])).rejects.toThrow(
        "Ao menos um item é necessário",
      );
    });

    it("lança erro para item com peso negativo", async () => {
      await expect(
        calculateShipping("12345-678", [
          { weight: -1, width: 10, height: 5, length: 20, quantity: 1 },
        ]),
      ).rejects.toThrow("Peso deve ser positivo");
    });

    it("lança erro para item com quantidade zero", async () => {
      await expect(
        calculateShipping("12345-678", [
          { weight: 1, width: 10, height: 5, length: 20, quantity: 0 },
        ]),
      ).rejects.toThrow("Quantidade deve ser maior que zero");
    });
  });
});
