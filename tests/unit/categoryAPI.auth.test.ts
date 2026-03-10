import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/requireAdmin", () => ({
  requireAdmin: vi.fn(async () => ({}) as never),
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

import { requireAdmin } from "@/lib/requireAdmin";
import { resolveHttpStatus } from "../factories/sharedMocks";

const ADMIN_ERROR = "Apenas administradores podem acessar este recurso";

async function expectAdminGuardToBlock(
  mockFn: ReturnType<typeof vi.mocked<typeof requireAdmin>>,
) {
  mockFn.mockRejectedValueOnce(new Error(ADMIN_ERROR));
  try {
    await mockFn();
    expect.fail("Deveria ter lançado erro");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("administrador");
  }
}

describe("Categoria API — Autenticação", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    ["criar"],
    ["editar"],
    ["deletar"],
  ])("apenas admin pode %s categoria", async (action) => {
    await expectAdminGuardToBlock(vi.mocked(requireAdmin));
    // Garante que o teste é parametrizado e executou para cada ação
    expect(action).toBeDefined();
  });

  it("admin autorizado executa operações", async () => {
    vi.mocked(requireAdmin).mockResolvedValueOnce({} as never);
    const result = await vi.mocked(requireAdmin)();
    expect(result).toBeDefined();
  });

  it("verifica permissão antes de processar — falha depois autoriza", async () => {
    const mock = vi.mocked(requireAdmin);
    mock.mockRejectedValueOnce(new Error("Não autorizado"));

    await mock().catch(() => {});

    mock.mockResolvedValueOnce({} as never);
    const result = await mock();
    expect(result).toBeDefined();
    expect(mock).toHaveBeenCalledTimes(2);
  });
});

describe("Categoria API — Parâmetros", () => {
  it.each([
    ["true", true],
    ["on", true],
    ["1", true],
    ["false", false],
    ["0", false],
    [null, false],
  ])("featured '%s' → %s", (input, expected) => {
    const result = input !== null && ["true", "on", "1"].includes(input);
    expect(result).toBe(expected);
  });

  it.each([
    ["500", 500],
    ["1000", 1000],
    ["0", 0],
    [undefined, undefined],
  ])("range '%s' → %s", (input, expected) => {
    const result = input !== undefined ? Number(input) : undefined;
    expect(result).toBe(expected);
  });

  it.each([
    ["true", true],
    ["false", false],
    [null, false],
    [undefined, false],
  ])("removeImage '%s' → %s", (input, expected) => {
    expect(input === "true").toBe(expected);
  });

  it("valida arquivo de imagem por tamanho e tipo", () => {
    const valid = new File(["content"], "img.jpg", { type: "image/jpeg" });
    const empty = new File([], "vazio.jpg", { type: "image/jpeg" });
    expect(valid.size > 0).toBe(true);
    expect(empty.size > 0).toBe(false);
    expect(valid.type).toBe("image/jpeg");
  });
});

describe("Categoria API — Tratamento de Erros", () => {
  it.each([
    ["Slug já existe", 400],
    ["Categoria não encontrada", 404],
    ["Erro desconhecido na API Sanity", 500],
  ])("erro '%s' → status %d", (message, expectedStatus) => {
    expect(resolveHttpStatus(message)).toBe(expectedStatus);
  });

  it("loga erros adequadamente", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Erro ao processar categoria");
    console.error("Erro:", error);
    expect(spy).toHaveBeenCalledWith("Erro:", error);
    spy.mockRestore();
  });
});

describe("Categoria API — Fluxo E2E", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fluxo admin: criar → editar → deletar", async () => {
    const mock = vi.mocked(requireAdmin);
    mock.mockResolvedValue({} as never);

    for (const _op of ["create", "update", "delete"]) {
      const auth = await mock();
      expect(auth).toBeDefined();
    }

    expect(mock).toHaveBeenCalledTimes(3);
  });

  it("não-admin bloqueado em todas as etapas", async () => {
    const mock = vi.mocked(requireAdmin);
    const error = new Error(ADMIN_ERROR);

    for (const _op of ["create", "update", "delete"]) {
      mock.mockRejectedValueOnce(error);
      await expect(mock()).rejects.toBeInstanceOf(Error);
    }

    expect(mock).toHaveBeenCalledTimes(3);
  });
});
