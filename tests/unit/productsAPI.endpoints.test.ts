import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const makeProductFormData = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();

  const defaults: Record<string, string> = {
    name: "Produto Teste",
    description: "Descrição",
    price: "99.99",
    discount: "0",
    stock: "10",
    weight: "1.5",
    width: "10",
    height: "20",
    length: "30",
    ...overrides,
  };

  for (const [key, value] of Object.entries(defaults)) {
    formData.append(key, value);
  }

  return formData;
};

describe("Products API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(requireAdmin).mockResolvedValue(undefined);

    vi.mocked(extractImagesFromFormData).mockReturnValue({
      existingImages: [],
      newImageFiles: [],
    });
  });

  describe("POST /api/admin/products", () => {
    it("deve criar produto com dados válidos", async () => {
      const mockExecute = vi
        .spyOn(CreateProduct.prototype, "execute")
        .mockResolvedValue(undefined);

      const formData = makeProductFormData({
        status: "active",
        variant: "color",
        isFeatured: "true",
      });
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        {
          method: "POST",
          body: formData as any,
        },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockExecute).toHaveBeenCalled();
    });

    it("deve criar produto com imagens", async () => {
      const formData = makeProductFormData();

      const file = new File(["image"], "image.jpg", {
        type: "image/jpeg",
      });

      formData.append("images", file);

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        { method: "POST", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("deve criar produto com categorias", async () => {
      const spy = vi.spyOn(CreateProduct.prototype, "execute");

      const formData = makeProductFormData();
      formData.append("categories", "cat-1");
      formData.append("categories", "cat-2");

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        { method: "POST", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const callArgs = spy.mock.calls[0][0];

      expect(callArgs.categories).toHaveLength(2);
      expect(callArgs.categories[0]._ref).toBe("cat-1");
    });

    it("deve criar produto com marca", async () => {
      const spy = vi.spyOn(CreateProduct.prototype, "execute");

      const formData = makeProductFormData({ brand: "brand-1" });
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        {
          method: "POST",
          body: formData as any,
        },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      const callArgs = spy.mock.calls[0][0];

      expect(callArgs.brand._ref).toBe("brand-1");
    });

    it("deve retornar 400 se slug já existe", async () => {
      vi.spyOn(CreateProduct.prototype, "execute").mockRejectedValue(
        new Error("Slug já existe"),
      );

      const formData = makeProductFormData();
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        { method: "POST", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toContain("Slug já existe");
    });

    it("deve retornar 403 se não autorizado", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const formData = makeProductFormData();
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products"),
        { method: "POST", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await productsRoute.POST(request);

      expect([401, 403]).toContain(response.status);
    });
  });

  describe("PUT /api/admin/products/[id]", () => {
    it("deve atualizar produto com dados válidos", async () => {
      const spy = vi
        .spyOn(UpdateProduct.prototype, "execute")
        .mockResolvedValue(undefined);

      const formData = makeProductFormData({ isFeatured: "false" });
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products/prod-123"),
        {
          method: "PUT",
          body: formData as any,
        },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await PUT(request, {
        params: Promise.resolve({ id: "prod-123" }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it("deve retornar 400 se slug duplicado ao atualizar", async () => {
      vi.spyOn(UpdateProduct.prototype, "execute").mockRejectedValue(
        new Error("Slug já existe"),
      );

      const formData = makeProductFormData();
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products/prod-123"),
        { method: "PUT", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await PUT(request, {
        params: Promise.resolve({ id: "prod-123" }),
      });

      expect(response.status).toBe(400);
    });

    it("deve retornar 403 se não autorizado", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const formData = makeProductFormData();
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products/prod-123"),
        { method: "PUT", body: formData as any },
      );

      vi.spyOn(request, "formData").mockResolvedValue(formData);

      const response = await PUT(request, {
        params: Promise.resolve({ id: "prod-123" }),
      });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe("DELETE /api/admin/products/[id]", () => {
    it("deve deletar produto com sucesso", async () => {
      const spy = vi
        .spyOn(DeleteProduct.prototype, "execute")
        .mockResolvedValue(undefined);

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products/prod-123"),
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "prod-123" }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(spy).toHaveBeenCalledWith("prod-123");
    });

    it("deve retornar 500 em caso de erro", async () => {
      vi.spyOn(DeleteProduct.prototype, "execute").mockRejectedValue(
        new Error("Database error"),
      );

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/products/prod-123"),
        { method: "DELETE" },
      );

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "prod-123" }),
      });

      expect(response.status).toBe(500);
    });
  });
});
