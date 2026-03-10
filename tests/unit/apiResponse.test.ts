import { describe, expect, it } from "vitest";
import { errorResponse, successResponse } from "../../lib/api/apiResponse";

describe("successResponse", () => {
  it("retorna status 200 por padrão", async () => {
    const response = successResponse();

    expect(response.status).toBe(200);
  });

  it("retorna { success: true } no body", async () => {
    const response = successResponse();
    const body = await response.json();

    expect(body).toEqual({ success: true });
  });

  it("aceita dados adicionais mesclados no body", async () => {
    const response = successResponse({ id: "1", name: "Test" });
    const body = await response.json();

    expect(body).toEqual({ success: true, id: "1", name: "Test" });
  });

  it("aceita status customizado", async () => {
    const response = successResponse({}, 201);

    expect(response.status).toBe(201);
  });

  it("status customizado inclui dados mesclados no body", async () => {
    const response = successResponse({ id: "123" }, 201);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ success: true, id: "123" });
  });
});

describe("errorResponse", () => {
  it("retorna { success: false, message } no body", async () => {
    const response = errorResponse("Erro qualquer", 500);
    const body = await response.json();

    expect(body).toEqual({ success: false, message: "Erro qualquer" });
  });

  it("retorna o status code informado", async () => {
    const response = errorResponse("Erro", 400);

    expect(response.status).toBe(400);
  });

  it("errorResponse com status 400", async () => {
    const response = errorResponse("Slug já existe", 400);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Slug já existe");
  });

  it("errorResponse com status 500", async () => {
    const response = errorResponse("Erro interno do servidor", 500);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.message).toBe("Erro interno do servidor");
  });

  it("errorResponse com status 404", async () => {
    const response = errorResponse("Categoria não encontrada", 404);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Categoria não encontrada");
  });
});
