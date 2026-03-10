import { describe, expect, it } from "vitest";
import { productSchema } from "../../../lib/schemas/productSchema";

describe("productSchema", () => {
  const validProduct = {
    name: "Produto Teste",
    description: "Descrição do produto",
    price: 100,
    discount: 10,
    stock: 50,
    weight: 1.5,
    width: 10,
    height: 20,
    length: 30,
    status: "active",
    variant: "var1",
    isFeatured: true,
    categories: ["cat1", "cat2"],
    brand: "brand1",
    images: [],
  };

  it("deve validar produto válido com todos os campos", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("deve validar produto válido com campos obrigatórios", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(true);
  });

  it("deve falhar quando name está vazio", () => {
    const result = productSchema.safeParse({
      name: "",
      description: "Desc",
      price: 10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Nome é obrigatório");
  });

  it("deve falhar quando description está vazio", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "",
      price: 10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Descrição é obrigatória");
  });

  it("deve falhar quando price é negativo", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: -10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Preço deve ser positivo");
  });

  it("deve falhar quando discount é maior que 100", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      discount: 150,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Desconto deve estar entre 0 e 100",
    );
  });

  it("deve falhar quando stock é negativo", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      stock: -5,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Estoque não pode ser negativo",
    );
  });

  it("deve falhar quando weight é zero", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      weight: 0,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Peso deve ser positivo");
  });

  it("deve usar discount como 0 por padrão", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(true);
    expect(result.data?.discount).toBe(0);
  });

  it("deve usar stock como 0 por padrão", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      description: "Desc",
      price: 10,
      weight: 1,
      width: 1,
      height: 1,
      length: 1,
    });
    expect(result.success).toBe(true);
    expect(result.data?.stock).toBe(0);
  });
});
