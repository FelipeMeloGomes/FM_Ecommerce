import { describe, expect, it } from "vitest";
import { toHttpStatus } from "../../lib/httpError";

describe("toHttpStatus", () => {
  it("deve retornar 500 para erro não-Error", () => {
    expect(toHttpStatus("string error")).toBe(500);
    expect(toHttpStatus(null)).toBe(500);
    expect(toHttpStatus(undefined)).toBe(500);
    expect(toHttpStatus({ message: "erro" })).toBe(500);
  });

  it("deve retornar 400 para Slug já existe", () => {
    expect(toHttpStatus(new Error("Slug já existe"))).toBe(400);
  });

  it("deve retornar 403 para Unauthorized ou Forbidden", () => {
    expect(toHttpStatus(new Error("Unauthorized"))).toBe(403);
    expect(toHttpStatus(new Error("Forbidden"))).toBe(403);
  });

  it("deve retornar 404 para Categoria não encontrada", () => {
    expect(toHttpStatus(new Error("Categoria não encontrada"))).toBe(404);
  });

  it("deve retornar 404 para Produto não encontrado", () => {
    expect(toHttpStatus(new Error("Produto não encontrado"))).toBe(404);
  });

  it("deve retornar 500 para outros erros", () => {
    expect(toHttpStatus(new Error("Erro genérico"))).toBe(500);
    expect(toHttpStatus(new Error("Algo deu errado"))).toBe(500);
  });
});
