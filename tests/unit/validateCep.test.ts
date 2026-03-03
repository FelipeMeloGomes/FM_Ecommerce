import { describe, expect, it } from "vitest";
import { formatCep, isValidCep } from "../../helpers/validateCep";

describe("validateCep", () => {
  it("valida CEP no formato 12345-678", () => {
    expect(isValidCep("12345-678")).toBe(true);
  });

  it("valida CEP no formato 12345678", () => {
    expect(isValidCep("12345678")).toBe(true);
  });

  it("rejeita CEP inválido", () => {
    expect(isValidCep("1234-567")).toBe(false);
    expect(isValidCep("abcdefghi")).toBe(false);
    expect(isValidCep("")).toBe(false);
  });

  it("formata CEP removendo caracteres não numéricos e aplicando máscara", () => {
    expect(formatCep("12a345678b")).toBe("12345-678");
  });

  it("formata CEP curto sem hífen", () => {
    expect(formatCep("12345")).toBe("12345");
  });

  it("limita a 8 dígitos", () => {
    expect(formatCep("1234567890")).toBe("12345-678");
  });
});
