import { describe, expect, it } from "vitest";
import { addressSchemaWithDefault } from "../../../lib/schemas/addressSchema";

describe("addressSchema", () => {
  const validAddress = {
    name: "Casa",
    address: "Rua Teste, 123",
    city: "São Paulo",
    state: "SP",
    zip: "01234-567",
    default: true,
  };

  it("deve validar endereço válido com todos os campos", () => {
    const result = addressSchemaWithDefault.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("deve validar endereço válido com CEP sem hífen", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      zip: "01234567",
    });
    expect(result.success).toBe(true);
  });

  it("deve falhar quando name está vazio", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      name: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Nome muito curto");
  });

  it("deve falhar quando address está vazio", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      address: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Endereço muito curto");
  });

  it("deve falhar quando city está vazio", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      city: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Cidade obrigatória");
  });

  it("deve falhar quando state tem mais de 2 caracteres", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      state: "SPD",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Estado deve ter 2 caracteres",
    );
  });

  it("deve falhar quando state tem menos de 2 caracteres", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      state: "S",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Estado deve ter 2 caracteres",
    );
  });

  it("deve falhar quando CEP tem formato inválido", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      zip: "12345",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("CEP inválido");
  });

  it("deve falhar quando CEP tem letras", () => {
    const result = addressSchemaWithDefault.safeParse({
      ...validAddress,
      zip: "abcde-fgh",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("CEP inválido");
  });

  it("deve usar default como false por padrão", () => {
    const result = addressSchemaWithDefault.safeParse({
      name: "Casa",
      address: "Rua Teste",
      city: "São Paulo",
      state: "SP",
      zip: "01234-567",
    });
    expect(result.success).toBe(true);
    expect(result.data?.default).toBe(false);
  });
});
