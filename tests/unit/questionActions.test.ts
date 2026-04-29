import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAuth = vi.fn();
const mockCurrentUser = vi.fn();
const mockWriteClient = {
  create: vi.fn(),
  patch: vi.fn(() => mockPatchChain),
  delete: vi.fn(),
};
const mockClient = {
  fetch: vi.fn(),
};

const mockPatchChain = {
  set: vi.fn(() => mockPatchChain),
  commit: vi.fn(),
};

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: mockWriteClient,
}));

vi.mock("@/sanity/lib/client", () => ({
  client: mockClient,
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => mockAuth(),
  currentUser: () => mockCurrentUser(),
}));

const {
  sendProductQuestion,
  updateQuestion,
  deleteQuestion,
  answerQuestion,
  getProductQuestions,
} = await import("../../actions/questionActions");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("questionActions", () => {
  describe("sendProductQuestion", () => {
    it("retorna erro quando não autenticado", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      const result = await sendProductQuestion(
        "prod-1",
        "Produto",
        "Pergunta teste?",
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unauthorized");
      }
    });

    it("cria pergunta com sucesso quando autenticado", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockCurrentUser.mockResolvedValueOnce({
        fullName: "João Silva",
        imageUrl: "https://img.example/avatar.jpg",
      });
      mockWriteClient.create.mockResolvedValueOnce({ _id: "q-1" });

      const result = await sendProductQuestion(
        "prod-1",
        "Produto Teste",
        "Qual o prazo de entrega?",
      );

      expect(result).toEqual({ success: true, data: { id: "q-1" } });
      expect(mockWriteClient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: "productQuestion",
          userId: "user-1",
          customerName: "João Silva",
          question: "Qual o prazo de entrega?",
          productName: "Produto Teste",
          answered: false,
        }),
      );
    });

    it("usa nome padrão quando usuário não tem fullName", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockCurrentUser.mockResolvedValueOnce({ username: "joao123" });
      mockWriteClient.create.mockResolvedValueOnce({ _id: "q-2" });

      await sendProductQuestion("prod-1", "Produto", "Pergunta?");

      expect(mockWriteClient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: "joao123",
        }),
      );
    });
  });

  describe("updateQuestion", () => {
    it("retorna erro quando não autenticado", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      const result = await updateQuestion("q-1", "Nova pergunta aqui?");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unauthorized");
      }
    });

    it("retorna erro quando pergunta tem menos de 10 caracteres", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      const result = await updateQuestion("q-1", "curta");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Pergunta deve ter no mínimo 10 caracteres");
      }
    });

    it("retorna erro quando pergunta não existe", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockClient.fetch.mockResolvedValueOnce(null);
      const result = await updateQuestion(
        "q-1",
        "Pergunta válida com mais de 10 caracteres?",
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Pergunta não encontrada ou você não tem permissão",
        );
      }
    });

    it("retorna erro quando pergunta tem mais de 7 dias", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      mockClient.fetch.mockResolvedValueOnce({
        _id: "q-1",
        userId: "user-1",
        createdAt: oldDate.toISOString(),
      });
      const result = await updateQuestion(
        "q-1",
        "Pergunta válida com mais de 10 caracteres?",
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Não é possível editar perguntas com mais de 7 dias",
        );
      }
    });

    it("atualiza pergunta com sucesso", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 2);
      mockClient.fetch.mockResolvedValueOnce({
        _id: "q-1",
        userId: "user-1",
        createdAt: recentDate.toISOString(),
      });
      mockPatchChain.commit.mockResolvedValueOnce({});

      const result = await updateQuestion(
        "q-1",
        "Pergunta atualizada com sucesso?",
      );

      expect(result).toEqual({ success: true });
      expect(mockWriteClient.patch).toHaveBeenCalledWith("q-1");
      expect(mockPatchChain.set).toHaveBeenCalledWith({
        question: "Pergunta atualizada com sucesso?",
      });
    });
  });

  describe("deleteQuestion", () => {
    it("retorna erro quando não autenticado", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      const result = await deleteQuestion("q-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unauthorized");
      }
    });

    it("retorna erro quando pergunta não existe", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockClient.fetch.mockResolvedValueOnce(null);
      const result = await deleteQuestion("q-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "Pergunta não encontrada ou você não tem permissão",
        );
      }
    });

    it("deleta pergunta com sucesso", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockClient.fetch.mockResolvedValueOnce({
        _id: "q-1",
        userId: "user-1",
      });
      mockWriteClient.delete.mockResolvedValueOnce({});

      const result = await deleteQuestion("q-1");

      expect(result).toEqual({ success: true });
      expect(mockWriteClient.delete).toHaveBeenCalledWith("q-1");
    });
  });

  describe("getProductQuestions", () => {
    it("retorna array vazio quando há erro", async () => {
      mockClient.fetch.mockRejectedValueOnce(new Error("Network error"));
      const result = await getProductQuestions("prod-1");
      expect(result).toEqual([]);
    });

    it("retorna perguntas do produto", async () => {
      const questions = [
        { _id: "q-1", question: "Pergunta 1?", answered: false },
        { _id: "q-2", question: "Pergunta 2?", answered: true },
      ];
      mockClient.fetch.mockResolvedValueOnce(questions);

      const result = await getProductQuestions("prod-1");

      expect(result).toEqual(questions);
      expect(mockClient.fetch).toHaveBeenCalledWith(expect.any(String), {
        productId: "prod-1",
      });
    });
  });

  describe("answerQuestion", () => {
    it("retorna erro quando não autenticado", async () => {
      mockAuth.mockResolvedValueOnce({ userId: null });
      const result = await answerQuestion(
        "q-1",
        "Resposta válida com mais de 10 caracteres.",
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Unauthorized");
      }
    });

    it("retorna erro quando resposta tem menos de 10 caracteres", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      const result = await answerQuestion("q-1", "curta");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Resposta deve ter no mínimo 10 caracteres");
      }
    });

    it("retorna erro quando pergunta não existe", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockClient.fetch.mockResolvedValueOnce(null);
      const result = await answerQuestion(
        "q-1",
        "Resposta válida com mais de 10 caracteres.",
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Pergunta não encontrada");
      }
    });

    it("responde pergunta com sucesso", async () => {
      mockAuth.mockResolvedValueOnce({ userId: "user-1" });
      mockClient.fetch.mockResolvedValueOnce({ _id: "q-1" });
      mockPatchChain.commit.mockResolvedValueOnce({});

      const result = await answerQuestion(
        "q-1",
        "Esta é a resposta da loja para sua pergunta.",
      );

      expect(result).toEqual({ success: true });
      expect(mockWriteClient.patch).toHaveBeenCalledWith("q-1");
      expect(mockPatchChain.set).toHaveBeenCalledWith({
        answer: "Esta é a resposta da loja para sua pergunta.",
        answered: true,
      });
    });
  });
});
