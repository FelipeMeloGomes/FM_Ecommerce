import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/requireAdmin");
vi.mock("@/core/categories/CreateCategory");
vi.mock("@/core/categories/UpdateCategory");
vi.mock("@/core/categories/DeleteCategory");
vi.mock("@/services/categories/SanityCategoryRepository");
vi.mock("@/services/categories/SanityCategoryImageGateway");
vi.mock("@/services/products/SlugService");

vi.mock("@/sanity/env", () => ({
  projectId: "test-project-id",
  dataset: "test-dataset",
  apiVersion: "2024-01-01",
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: {
    create: vi.fn(),
    fetch: vi.fn(),
    patch: vi.fn(() => ({
      set: vi.fn(() => ({ commit: vi.fn() })),
      unset: vi.fn(() => ({ commit: vi.fn() })),
    })),
    delete: vi.fn(),
  },
}));

import { DELETE, PUT } from "@/app/(client)/api/admin/categories/[id]/route";
import * as categoriesRoute from "@/app/(client)/api/admin/categories/route";
import { CreateCategory } from "@/core/categories/CreateCategory";
import { DeleteCategory } from "@/core/categories/DeleteCategory";
import { UpdateCategory } from "@/core/categories/UpdateCategory";
import { requireAdmin } from "@/lib/requireAdmin";
import { makeAdminUser } from "../factories/sharedMocks";

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
  vi.mocked(requireAdmin).mockResolvedValue(makeAdminUser());
});

describe("POST /api/admin/categories — Criação", () => {
  it("retorna 200 quando categoria é criada com sucesso", async () => {
    const spy = vi
      .spyOn(CreateCategory.prototype, "execute")
      .mockResolvedValue(undefined);

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
    expect(spy).toHaveBeenCalled();
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
    vi.spyOn(CreateCategory.prototype, "execute").mockRejectedValue(
      new Error("Slug já existe"),
    );

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

  it("retorna 403 quando usuário não está autenticado", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

    const formData = makeFormData({
      title: "Eletrônicos",
    });

    const req = makeRequest(
      "http://localhost:3000/api/admin/categories",
      "POST",
      formData,
    );

    const response = await categoriesRoute.POST(req);

    expect(response.status).toBe(403);
  });

  it("retorna 403 quando usuário não é admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Forbidden"));

    const formData = makeFormData({
      title: "Eletrônicos",
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

describe("PUT /api/admin/categories/{id} — Atualização", () => {
  const catUrl = "http://localhost:3000/api/admin/categories/cat-123";
  const catParams = { params: Promise.resolve({ id: "cat-123" }) };

  it("retorna 200 quando categoria é atualizada com sucesso", async () => {
    const spy = vi
      .spyOn(UpdateCategory.prototype, "execute")
      .mockResolvedValue(undefined);

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
    expect(spy).toHaveBeenCalled();
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
    vi.spyOn(UpdateCategory.prototype, "execute").mockRejectedValue(
      new Error("Categoria não encontrada"),
    );

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

  it("retorna 400 quando slug já existe em outra categoria", async () => {
    vi.spyOn(UpdateCategory.prototype, "execute").mockRejectedValue(
      new Error("Slug já existe"),
    );

    const formData = makeFormData({
      title: "Nova Categoria",
    });

    const req = makeRequest(catUrl, "PUT", formData);
    const response = await PUT(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("Slug já existe");
  });

  it("remove imagem quando _removeImage=true", async () => {
    vi.spyOn(UpdateCategory.prototype, "execute").mockResolvedValue(undefined);

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
});

describe("DELETE /api/admin/categories/{id} — Deleção", () => {
  const catUrl = "http://localhost:3000/api/admin/categories/cat-123";
  const catParams = { params: Promise.resolve({ id: "cat-123" }) };

  it("retorna 200 quando categoria é deletada com sucesso", async () => {
    const spy = vi
      .spyOn(DeleteCategory.prototype, "execute")
      .mockResolvedValue(undefined);

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(spy).toHaveBeenCalledWith("cat-123");
  });

  it("retorna 404 quando categoria não existe", async () => {
    vi.spyOn(DeleteCategory.prototype, "execute").mockRejectedValue(
      new Error("Categoria não encontrada"),
    );

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Categoria não encontrada");
  });

  it("retorna 403 quando usuário não está autenticado", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);

    expect(response.status).toBe(403);
  });

  it("retorna 403 quando usuário não é admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Forbidden"));

    const req = new NextRequest(new URL(catUrl), { method: "DELETE" });
    const response = await DELETE(req, catParams);

    expect(response.status).toBe(403);
  });
});
