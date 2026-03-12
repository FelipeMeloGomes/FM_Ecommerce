import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/requireAdmin");

vi.mock("@/sanity/env", () => ({
  projectId: "test-project-id",
  dataset: "test-dataset",
  apiVersion: "2024-01-01",
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: {
    fetch: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(() => ({
      set: vi.fn(() => ({
        commit: vi.fn().mockResolvedValue(undefined),
        unset: vi.fn(() => ({ commit: vi.fn().mockResolvedValue(undefined) })),
      })),
      unset: vi.fn(() => ({ commit: vi.fn().mockResolvedValue(undefined) })),
    })),
    delete: vi.fn().mockResolvedValue(undefined),
    assets: {
      upload: vi.fn().mockResolvedValue({ _id: "asset-123" }),
    },
  },
}));

import { DELETE, PUT } from "@/app/(client)/api/admin/categories/[id]/route";
import * as categoriesRoute from "@/app/(client)/api/admin/categories/route";
import { requireAdmin } from "@/lib/requireAdmin";
import { writeClient } from "@/sanity/lib/writeClient";

const makeFormData = (
  fields: Record<string, string | File | undefined> = {},
): FormData => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });
  return formData;
};

const makeImageFile = (name = "test.jpg", content = "fake content") =>
  new File([content], name, { type: "image/jpeg" });

const makeRequest = (url: string, method: string, formData: FormData) => {
  const req = new NextRequest(new URL(url), {
    method,
    body: formData as never,
  });
  vi.spyOn(req, "formData").mockResolvedValue(formData);
  return req;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAdmin).mockResolvedValue(undefined as never);
  vi.mocked(writeClient.fetch).mockResolvedValue(null as never);
  vi.mocked(writeClient.create).mockResolvedValue({ _id: "cat-new" } as never);
  vi.mocked(writeClient.delete).mockResolvedValue({} as never);
});

describe("POST /api/admin/categories", () => {
  it("retorna 200 quando categoria é criada com sucesso", async () => {
    const formData = makeFormData({
      title: "Eletrônicos",
      description: "Descrição",
      range: "500",
      featured: "true",
    });
    formData.append("image", makeImageFile());

    const req = makeRequest(
      "http://localhost:3000/api/admin/categories",
      "POST",
      formData,
    );

    const response = await categoriesRoute.POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("retorna 400 quando título está vazio", async () => {
    const formData = makeFormData({
      title: "",
      description: "Descrição",
    });

    const req = makeRequest(
      "http://localhost:3000/api/admin/categories",
      "POST",
      formData,
    );

    const response = await categoriesRoute.POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Título é obrigatório");
  });

  it("retorna 400 quando slug já existe", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce({
      _id: "existing-id",
      title: "Eletrônicos",
      slug: { current: "eletronicos" },
    } as never);

    const formData = makeFormData({
      title: "Eletrônicos",
      description: "Descrição",
    });

    const req = makeRequest(
      "http://localhost:3000/api/admin/categories",
      "POST",
      formData,
    );

    const response = await categoriesRoute.POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Slug já existe");
  });

  it("retorna 403 quando usuário não é admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("Forbidden"));

    const formData = makeFormData({
      title: "Camisetas",
    });

    const req = makeRequest(
      "http://localhost:3000/api/admin/categories",
      "POST",
      formData,
    );

    const response = await categoriesRoute.POST(req);

    expect(response.status).toBe(403);
  });
});

describe("PUT /api/admin/categories/[id]", () => {
  const catUrl = "http://localhost:3000/api/admin/categories/cat-123";
  const catParams = { params: Promise.resolve({ id: "cat-123" }) };

  it("retorna 200 quando categoria é atualizada com sucesso", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce({
      _id: "cat-123",
      title: "Eletrônicos",
      slug: { current: "eletronicos" },
    } as never);

    const formData = makeFormData({
      title: "Eletrônicos Atualizado",
      description: "Nova descrição",
      range: "1000",
      featured: "false",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const response = await PUT(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("retorna 400 quando título está vazio", async () => {
    const formData = makeFormData({
      title: "",
      description: "Nova descrição",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const response = await PUT(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Título é obrigatório");
  });

  it("retorna 404 quando categoria não existe", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce(null as never);

    const formData = makeFormData({
      title: "Nova Categoria",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const notFoundParams = { params: Promise.resolve({ id: "cat-999" }) };
    const response = await PUT(req, notFoundParams);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Categoria não encontrada");
  });

  it("retorna 200 ao processar removeImage", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce({
      _id: "cat-123",
      title: "Categoria",
      slug: { current: "categoria" },
    } as never);

    const formData = makeFormData({
      title: "Categoria Atualizada",
      _removeImage: "true",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const response = await PUT(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("retorna 403 quando usuário não é admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("Forbidden"));

    const formData = makeFormData({
      title: "Categoria Atualizada",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const response = await PUT(req, catParams);

    expect(response.status).toBe(403);
  });
});

describe("DELETE /api/admin/categories/[id]", () => {
  const catUrl = "http://localhost:3000/api/admin/categories/cat-123";
  const catParams = { params: Promise.resolve({ id: "cat-123" }) };

  it("retorna 200 quando categoria é deletada com sucesso", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce({
      _id: "cat-123",
      title: "Eletrônicos",
    } as never);

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("retorna 404 quando categoria não existe", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValueOnce(null as never);
    vi.mocked(writeClient.delete).mockRejectedValueOnce(
      new Error("Categoria não encontrada"),
    );

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Categoria não encontrada");
  });

  it("retorna 403 quando usuário não é admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("Forbidden"));

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);

    expect(response.status).toBe(403);
  });
});
