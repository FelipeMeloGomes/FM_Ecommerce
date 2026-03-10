import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeAdminUser, makeProductFormData } from "../factories/sharedMocks";

vi.mock("@/lib/requireAdmin");
vi.mock("@/core/products/CreateProduct");
vi.mock("@/core/products/DeleteProduct");
vi.mock("@/services/products/SanityProductRepository");
vi.mock("@/services/products/SanityImageGateway");
vi.mock("@/services/products/SlugService");
vi.mock("@/lib/extractImagesFromFormData");

vi.mock("@/sanity/env", () => ({
  projectId: "test-project-id",
  dataset: "test-dataset",
  apiVersion: "2024-01-01",
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: {
    create: vi.fn(),
    patch: vi.fn(() => ({ set: vi.fn(() => ({ commit: vi.fn() })) })),
    delete: vi.fn(),
  },
}));

vi.mock("@/sanity/lib/backendClient", () => ({
  backendClient: {
    create: vi.fn(),
    patch: vi.fn(() => ({ set: vi.fn(() => ({ commit: vi.fn() })) })),
    delete: vi.fn(),
  },
}));

import { DELETE, PUT } from "@/app/(client)/api/admin/products/[id]/route";
import * as productsRoute from "@/app/(client)/api/admin/products/route";
import { CreateProduct } from "@/core/products/CreateProduct";
import { DeleteProduct } from "@/core/products/DeleteProduct";
import { UpdateProduct } from "@/core/products/UpdateProduct";
import { extractImagesFromFormData } from "@/lib/extractImagesFromFormData";
import { requireAdmin } from "@/lib/requireAdmin";

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
  vi.mocked(extractImagesFromFormData).mockReturnValue({
    existingImages: [],
    newImageFiles: [],
  });
});

describe("POST /api/admin/products", () => {
  it("cria produto com dados válidos", async () => {
    const spy = vi
      .spyOn(CreateProduct.prototype, "execute")
      .mockResolvedValue(undefined);
    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      makeProductFormData({
        status: "active",
        variant: "color",
        isFeatured: "true",
      }),
    );

    const response = await productsRoute.POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it("cria produto com imagem", async () => {
    const formData = makeProductFormData();
    formData.append(
      "images",
      new File(["image"], "image.jpg", { type: "image/jpeg" }),
    );

    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      formData,
    );
    const response = await productsRoute.POST(req);

    expect(response.status).toBe(200);
  });

  it("cria produto com categorias", async () => {
    const spy = vi.spyOn(CreateProduct.prototype, "execute");
    const formData = makeProductFormData();
    formData.append("categories", "cat-1");
    formData.append("categories", "cat-2");

    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      formData,
    );
    await productsRoute.POST(req);

    const callArgs = spy.mock.calls[0][0];
    expect(callArgs.categories).toHaveLength(2);
    expect(callArgs.categories[0]._ref).toBe("cat-1");
  });

  it("cria produto com marca", async () => {
    const spy = vi.spyOn(CreateProduct.prototype, "execute");
    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      makeProductFormData({ brand: "brand-1" }),
    );
    await productsRoute.POST(req);

    const brand = spy.mock.calls[0][0].brand;
    expect(brand).toBeDefined();
    expect(brand?._ref).toBe("brand-1");
  });

  it("retorna 400 se slug já existe", async () => {
    vi.spyOn(CreateProduct.prototype, "execute").mockRejectedValue(
      new Error("Slug já existe"),
    );

    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      makeProductFormData(),
    );
    const response = await productsRoute.POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toContain("Slug já existe");
  });

  it("retorna 401/403 se não autorizado", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

    const req = makeRequest(
      "http://localhost:3000/api/admin/products",
      "POST",
      makeProductFormData(),
    );
    const response = await productsRoute.POST(req);

    expect([401, 403]).toContain(response.status);
  });
});

describe("PUT /api/admin/products/[id]", () => {
  const prodUrl = "http://localhost:3000/api/admin/products/prod-123";
  const prodParams = { params: Promise.resolve({ id: "prod-123" }) };

  it("atualiza produto com dados válidos", async () => {
    const spy = vi
      .spyOn(UpdateProduct.prototype, "execute")
      .mockResolvedValue(undefined);
    const req = makeRequest(
      prodUrl,
      "PUT",
      makeProductFormData({ isFeatured: "false" }),
    );

    const response = await PUT(req, prodParams);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it("retorna 400 se slug duplicado", async () => {
    vi.spyOn(UpdateProduct.prototype, "execute").mockRejectedValue(
      new Error("Slug já existe"),
    );

    const response = await PUT(
      makeRequest(prodUrl, "PUT", makeProductFormData()),
      prodParams,
    );

    expect(response.status).toBe(400);
  });

  it("retorna 401/403 se não autorizado", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

    const response = await PUT(
      makeRequest(prodUrl, "PUT", makeProductFormData()),
      prodParams,
    );

    expect([401, 403]).toContain(response.status);
  });
});

describe("DELETE /api/admin/products/[id]", () => {
  const prodUrl = "http://localhost:3000/api/admin/products/prod-123";
  const prodParams = { params: Promise.resolve({ id: "prod-123" }) };

  it("deleta produto com sucesso", async () => {
    const spy = vi
      .spyOn(DeleteProduct.prototype, "execute")
      .mockResolvedValue(undefined);
    const req = new NextRequest(new URL(prodUrl), { method: "DELETE" });

    const response = await DELETE(req, prodParams);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(spy).toHaveBeenCalledWith("prod-123");
  });

  it("retorna 500 em caso de erro", async () => {
    vi.spyOn(DeleteProduct.prototype, "execute").mockRejectedValue(
      new Error("Database error"),
    );

    const response = await DELETE(
      new NextRequest(new URL(prodUrl), { method: "DELETE" }),
      prodParams,
    );

    expect(response.status).toBe(500);
  });
});
