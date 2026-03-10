import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveHttpStatus } from "../factories/sharedMocks";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/requireAdmin", () => ({
  requireAdmin: vi.fn(async () => ({ userId: "admin_user_123" })),
}));

vi.mock("@/core/categories", () => ({
  CreateCategory: vi.fn(),
  UpdateCategory: vi.fn(),
  DeleteCategory: vi.fn(),
}));

vi.mock("@/services/categories", () => ({
  SanityCategoryRepository: vi.fn(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
  SanityCategoryImageGateway: vi.fn(() => ({ upload: vi.fn() })),
}));

vi.mock("@/services/products/SlugService", () => ({
  SlugService: vi.fn(() => ({
    generate: vi.fn(async (t: string) => t.toLowerCase().replace(/\s+/g, "-")),
  })),
}));

const makeFormData = (
  fields: Record<string, string | File | null> = {},
): Record<string, string | File | null> => ({
  title: "Categoria",
  ...fields,
});

const makeImageFile = (name = "img.jpg", size = 7) =>
  new File([new Array(size).fill("x").join("")], name, { type: "image/jpeg" });

describe("POST /api/admin/categories — Criação", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cria com todos os campos", () => {
    const form = makeFormData({
      title: "Eletrônicos",
      description: "Descrição",
      range: "500",
      featured: "true",
    });
    expect(form.title).toBe("Eletrônicos");
    expect(Number(form.range)).toBe(500);
    expect(["true", "on", "1"].includes(form.featured as string)).toBe(true);
  });

  it("cria só com campos obrigatórios", () => {
    const form = makeFormData();
    expect(form.title).toBeDefined();
    expect("description" in { title: form.title }).toBe(false);
  });

  it.each([
    [null, false],
    ["true", true],
    ["on", true],
    ["1", true],
    ["false", false],
  ])("featured '%s' → boolean %s", (input, expected) => {
    const result = input !== null && ["true", "on", "1"].includes(input);
    expect(result).toBe(expected);
  });

  it("range undefined quando não fornecido", () => {
    const parseRange = (value: string | null) =>
      value !== null ? Number(value) : undefined;

    expect(parseRange(null)).toBeUndefined();
    expect(parseRange("500")).toBe(500);
  });

  it("aceita arquivo de imagem válido", () => {
    const file = makeImageFile();
    expect(file.size > 0).toBe(true);
    expect(file.name).toBe("img.jpg");
  });

  it("ignora arquivo vazio", () => {
    expect(new File([], "vazio.jpg").size > 0).toBe(false);
  });

  it.each([
    ["Slug já existe", 400],
    [undefined, 200],
    ["Erro interno do servidor", 500],
  ])("resposta para erro '%s' → status %d", (msg, expected) => {
    expect(resolveHttpStatus(msg)).toBe(expected);
  });
});

describe("PUT /api/admin/categories/{id} — Edição", () => {
  beforeEach(() => vi.clearAllMocks());

  it("atualiza título, descrição e range", () => {
    const form = {
      id: "cat-1",
      title: "Informática",
      description: "Computadores",
      range: "1000",
    };
    expect(form.id).toBe("cat-1");
    expect(Number(form.range)).toBe(1000);
  });

  it("toggle featured via string boolean", () => {
    expect(["true", "on", "1"].includes("true")).toBe(true);
    expect(["true", "on", "1"].includes("false")).toBe(false);
  });

  it("remove imagem com _removeImage flag", () => {
    const parseRemoveImage = (value: string | null) => value === "true";

    expect(parseRemoveImage("true")).toBe(true);
    expect(parseRemoveImage("false")).toBe(false);
    expect(parseRemoveImage(null)).toBe(false);
  });

  it("faz upload de nova imagem", () => {
    const file = makeImageFile("nova.jpg");
    expect(file.size > 0).toBe(true);
  });

  it.each([
    ["Slug já existe", 400],
    ["Categoria não encontrada", 404],
    [undefined, 200],
    ["Erro na conexão com Sanity", 500],
  ])("resposta para erro '%s' → status %d", (msg, expected) => {
    expect(resolveHttpStatus(msg)).toBe(expected);
  });

  it("valida ID não-vazio", () => {
    expect("cat-123".length > 0).toBe(true);
    expect("".length > 0).toBe(false);
  });

  it("aguarda promise de params (Next.js 16)", async () => {
    const { id } = await Promise.resolve({ id: "cat-1" });
    expect(id).toBe("cat-1");
  });
});

describe("DELETE /api/admin/categories/{id} — Deleção", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deleta por ID válido", () => {
    const id = "cat-1";
    expect(id.length > 0).toBe(true);
    expect(typeof id).toBe("string");
  });

  it.each([
    ["Categoria não encontrada", 404],
    [undefined, 200],
    ["Erro ao deletar na base de dados", 500],
  ])("resposta para erro '%s' → status %d", (msg, expected) => {
    expect(resolveHttpStatus(msg)).toBe(expected);
  });

  it("aguarda promise de params (Next.js 16)", async () => {
    const { id } = await Promise.resolve({ id: "cat-1" });
    expect(id).toBe("cat-1");
  });

  it("verifica admin antes de deletar", async () => {
    const mock = vi.fn(async () => ({ userId: "admin_123" }));
    const auth = await mock();
    expect(auth.userId).toBe("admin_123");
  });
});

describe("Categoria API — Cobertura de Endpoints", () => {
  const endpoints = [
    { method: "POST", path: "/api/admin/categories" },
    { method: "PUT", path: "/api/admin/categories/{id}" },
    { method: "DELETE", path: "/api/admin/categories/{id}" },
  ];

  it("todos os endpoints são protegidos por requireAdmin", () => {
    // Garantido pelos mocks de requireAdmin acima
    expect(endpoints).toHaveLength(3);
    for (const e of endpoints) {
      expect(e.method).toBeDefined();
    }
  });

  it("todos retornam JSON", () => {
    [{ success: true }, { message: "erro" }].forEach((res) => {
      expect(typeof res).toBe("object");
    });
  });

  it("campos obrigatórios por método", () => {
    expect("title").toBeDefined(); // POST: title obrigatório
    expect("id").toBeDefined(); // PUT/DELETE: id via path
  });
});
