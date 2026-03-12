import { describe, expect, it } from "vitest";
import { errorResponse, successResponse } from "../../lib/api/apiResponse";

describe("successResponse", () => {
  it("retorna status 200 { success: true } por padrão", async () => {
    const response = successResponse();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
  });

  it("aceita dados adicionais mesclados no body", async () => {
    const response = successResponse({ id: "1", name: "Test" });
    const body = await response.json();

    expect(body).toEqual({ success: true, id: "1", name: "Test" });
  });

  it("aceita status customizado com dados", async () => {
    const response = successResponse({ id: "123" }, 201);

    expect(response.status).toBe(201);
  });

  it("mantém dados mesclados com status customizado", async () => {
    const response = successResponse({ id: "123" }, 201);
    const body = await response.json();

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
});
