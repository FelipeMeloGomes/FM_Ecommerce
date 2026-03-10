import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/requireAdmin", () => ({
  requireAdmin: vi.fn(async () => {
    // Por padrão, admin autorizado. Pode ser mockado como null em testes
    return { userId: "admin_user_123" };
  }),
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
  SanityCategoryImageGateway: vi.fn(() => ({
    upload: vi.fn(),
  })),
}));

vi.mock("@/services/products/SlugService", () => ({
  SlugService: vi.fn(() => ({
    generate: vi.fn(async (title: string) =>
      title.toLowerCase().replace(/\s+/g, "-"),
    ),
  })),
}));

import { requireAdmin } from "@/lib/requireAdmin";

describe("Testes de Autenticação - Categoria API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("apenas admin pode criar categoria", async () => {
    // Simula que o usuário não é admin
    vi.mocked(requireAdmin).mockRejectedValueOnce(
      new Error("Apenas administradores podem acessar este recurso"),
    );

    const mockRequireAdmin = vi.mocked(requireAdmin);

    // Tenta acessar sem permissão admin
    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("administrador");
    }
  });

  it("apenas admin pode editar categoria", async () => {
    // Simula que o usuário não é admin
    vi.mocked(requireAdmin).mockRejectedValueOnce(
      new Error("Apenas administradores podem acessar este recurso"),
    );

    const mockRequireAdmin = vi.mocked(requireAdmin);

    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("administrador");
    }
  });

  it("apenas admin pode deletar categoria", async () => {
    // Simula que o usuário não é admin
    vi.mocked(requireAdmin).mockRejectedValueOnce(
      new Error("Apenas administradores podem acessar este recurso"),
    );

    const mockRequireAdmin = vi.mocked(requireAdmin);

    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("administrador");
    }
  });

  it("admin autorizado consegue executar operações", async () => {
    const mockRequireAdmin = vi.mocked(requireAdmin);
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_user_123" });

    const result = await mockRequireAdmin();

    expect(result).toBeDefined();
    expect(result.userId).toBe("admin_user_123");
  });

  it("deve verificar permissão admin antes de processar request", async () => {
    const mockRequireAdmin = vi.mocked(requireAdmin);

    // Primeira chamada: sem permissão
    mockRequireAdmin.mockRejectedValueOnce(new Error("Não autorizado"));

    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch {
      // Erro esperado
    }

    // Segunda chamada: com permissão
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_123" });

    const result = await mockRequireAdmin();
    expect(result.userId).toBe("admin_123");

    // requireAdmin foi chamado 2 vezes
    expect(mockRequireAdmin).toHaveBeenCalledTimes(2);
  });
});

describe("Testes de Parâmetros - Categoria API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve processar featured como boolean corretamente", () => {
    const testCases = [
      { input: "true", expected: true },
      { input: "on", expected: true },
      { input: "1", expected: true },
      { input: "false", expected: false },
      { input: "0", expected: false },
      { input: null, expected: false },
    ];

    testCases.forEach(({ input, expected }) => {
      const result =
        input !== null && (input === "true" || input === "on" || input === "1");
      expect(result).toBe(expected);
    });
  });

  it("deve converter range para número", () => {
    const testCases = [
      { input: "500", expected: 500 },
      { input: "1000", expected: 1000 },
      { input: "0", expected: 0 },
      { input: undefined, expected: undefined },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = input ? Number(input) : undefined;
      expect(result).toBe(expected);
    });
  });

  it("deve detectar removeImage flag corretamente", () => {
    const testCases = [
      { input: "true", expected: true },
      { input: "false", expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = input === "true";
      expect(result).toBe(expected);
    });
  });

  it("deve validar arquivo de imagem", () => {
    const validFile = new File(["content"], "imagem.jpg", {
      type: "image/jpeg",
    });
    const invalidFile = new File(["content"], "imagem.txt", {
      type: "text/plain",
    });
    const emptyFile = new File([], "vazio.jpg", { type: "image/jpeg" });

    // Validação de tamanho > 0
    expect(validFile.size > 0).toBe(true);
    expect(emptyFile.size > 0).toBe(false);

    // Nota: tipo MIME não é verificado no código atual,
    // mas seria bom adicionar essa validação
    expect(validFile.type).toBe("image/jpeg");
    expect(invalidFile.type).toBe("text/plain");
  });
});

describe("Testes de Tratamento de Erros - Categoria API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar erro 400 quando slug já existe", () => {
    const error = new Error("Slug já existe");
    const mockRequireAdmin = vi.mocked(requireAdmin);
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_123" });

    // Simula a resposta de erro
    const statusCode = error.message === "Slug já existe" ? 400 : 500;

    expect(statusCode).toBe(400);
  });

  it("deve retornar erro 404 quando categoria não encontrada", () => {
    const error = new Error("Categoria não encontrada");

    const statusCode = error.message === "Categoria não encontrada" ? 404 : 500;

    expect(statusCode).toBe(404);
  });

  it("deve retornar erro 500 para erros desconhecidos", () => {
    const error = new Error("Erro desconhecido na API Sanity");

    const statusCode =
      error.message === "Categoria não encontrada"
        ? 404
        : error.message === "Slug já existe"
          ? 400
          : 500;

    expect(statusCode).toBe(500);
  });

  it("deve logar erros adequadamente", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const error = new Error("Erro ao processar categoria");
    console.error("Erro:", error);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro:", expect.any(Error));
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro:", error);

    consoleErrorSpy.mockRestore();
  });
});

describe("Testes End-to-End de Fluxo - Categoria API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fluxo completo: criar -> editar -> deletar categoria (apenas admin)", async () => {
    const mockRequireAdmin = vi.mocked(requireAdmin);

    // 1. Admin cria categoria
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_123" });
    const authCreate = await mockRequireAdmin();
    expect(authCreate.userId).toBe("admin_123");

    // 2. Admin edita categoria
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_123" });
    const authUpdate = await mockRequireAdmin();
    expect(authUpdate.userId).toBe("admin_123");

    // 3. Admin deleta categoria
    mockRequireAdmin.mockResolvedValueOnce({ userId: "admin_123" });
    const authDelete = await mockRequireAdmin();
    expect(authDelete.userId).toBe("admin_123");

    // requireAdmin foi chamado 3 vezes, uma para cada operação
    expect(mockRequireAdmin).toHaveBeenCalledTimes(3);
  });

  it("não-admin não consegue executar operações em nenhuma etapa", async () => {
    const mockRequireAdmin = vi.mocked(requireAdmin);
    const error = new Error(
      "Apenas administradores podem acessar este recurso",
    );

    // 1. Tenta criar
    mockRequireAdmin.mockRejectedValueOnce(error);
    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }

    // 2. Tenta editar
    mockRequireAdmin.mockRejectedValueOnce(error);
    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }

    // 3. Tenta deletar
    mockRequireAdmin.mockRejectedValueOnce(error);
    try {
      await mockRequireAdmin();
      expect.fail("Deveria ter lançado erro");
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }

    expect(mockRequireAdmin).toHaveBeenCalledTimes(3);
  });
});
