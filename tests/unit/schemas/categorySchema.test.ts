import { describe, expect, it } from "vitest";
import { categorySchema } from "../../../lib/schemas/categorySchema";

describe("categorySchema", () => {
  const validCategory = {
    title: "Eletrônicos",
    description: "Categoria de eletrônicos",
    range: 100,
    featured: true,
    image: new File(["test"], "test.png", { type: "image/png" }),
  };

  it("deve validar categoria válida com todos os campos", () => {
    const result = categorySchema.safeParse(validCategory);
    expect(result.success).toBe(true);
  });

  it("deve validar categoria válida com apenas campos obrigatórios", () => {
    const result = categorySchema.safeParse({ title: "Eletrônicos" });
    expect(result.success).toBe(true);
  });

  it("deve falhar quando title está vazio", () => {
    const result = categorySchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Título é obrigatório");
  });

  it("deve falhar quando title está ausente", () => {
    const result = categorySchema.safeParse({ description: "Test" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("string");
  });

  it("deve falhar quando range é negativo", () => {
    const result = categorySchema.safeParse({ title: "Test", range: -10 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Range deve ser positivo");
  });

  it("deve usar featured como false por padrão", () => {
    const result = categorySchema.safeParse({ title: "Test" });
    expect(result.success).toBe(true);
    expect(result.data?.featured).toBe(false);
  });
});
