import type { User } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// mocks devem vir antes dos imports
vi.mock("@/lib/requireAdmin");

vi.mock("@/sanity/lib/backendClient", () => ({
  backendClient: {
    create: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: {
    create: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: vi.fn(),
  },
}));

vi.mock("@/sanity/env", () => ({
  projectId: "test-project-id",
  dataset: "test-dataset",
  apiVersion: "2024-01-01",
}));

import { DELETE as deleteOrderById } from "@/app/(client)/api/admin/orders/[id]/route";
import { DELETE as bulkDeleteOrders } from "@/app/(client)/api/admin/orders/bulk-delete/route";

import { requireAdmin } from "@/lib/requireAdmin";
import { backendClient } from "@/sanity/lib/backendClient";

/* -------------------------------------------------------------------------- */
/*                                  FACTORIES                                 */
/* -------------------------------------------------------------------------- */

const createMockUser = (): User =>
  ({
    id: "user_test_123",
    emailAddresses: [],
    firstName: "Admin",
    lastName: "Test",
  }) as unknown as User;

const createMockDeletedOrder = (id: string) => ({
  _id: id,
  _rev: "rev-test",
  _type: "order",
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
});

/* -------------------------------------------------------------------------- */
/*                             MOCKS TIPADOS                                  */
/* -------------------------------------------------------------------------- */

const mockedDelete = vi.mocked(backendClient.delete);

/* -------------------------------------------------------------------------- */
/*                                   SETUP                                    */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAdmin).mockResolvedValue(createMockUser());
});

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe("Orders API Endpoints", () => {
  describe("DELETE /api/admin/orders/[id]", () => {
    it("deve deletar ordem individual com sucesso", async () => {
      // Arrange
      const orderId = "order-123";

      mockedDelete.mockImplementation(async () =>
        createMockDeletedOrder(orderId),
      );

      const request = new NextRequest(
        new URL(`http://localhost:3000/api/admin/orders/${orderId}`),
        { method: "DELETE" },
      );

      // Act
      const response = await deleteOrderById(request, {
        params: Promise.resolve({ id: orderId }),
      });

      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalled();
    });

    it("deve retornar erro quando não autorizado", async () => {
      // Arrange
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/order-123"),
        { method: "DELETE" },
      );

      // Act
      const response = await deleteOrderById(request, {
        params: Promise.resolve({ id: "order-123" }),
      });

      // Assert
      expect([401, 403, 500]).toContain(response.status);
    });
  });

  describe("DELETE /api/admin/orders/bulk-delete", () => {
    it("deve deletar múltiplas ordens com sucesso", async () => {
      // Arrange
      const ids = ["order-1", "order-2", "order-3"];

      mockedDelete.mockImplementation(async (id) =>
        createMockDeletedOrder(String(id)),
      );

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({ ids }),
        },
      );

      // Act
      const response = await bulkDeleteOrders(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalledTimes(ids.length);
    });

    it("deve retornar 400 se nenhum ID for fornecido", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({ ids: [] }),
        },
      );

      const response = await bulkDeleteOrders(request);

      expect(response.status).toBe(400);
    });

    it("deve retornar 400 se ids não for um array", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({ ids: "order-1" }),
        },
      );

      const response = await bulkDeleteOrders(request);

      expect(response.status).toBe(400);
    });

    it("deve retornar 400 se ids não for fornecido", async () => {
      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({}),
        },
      );

      const response = await bulkDeleteOrders(request);

      expect(response.status).toBe(400);
    });

    it("deve retornar erro quando não autorizado", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({
            ids: ["order-1", "order-2"],
          }),
        },
      );

      const response = await bulkDeleteOrders(request);

      expect([401, 403]).toContain(response.status);
    });

    it("deve retornar 500 em caso de erro no banco", async () => {
      mockedDelete.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({
            ids: ["order-1", "order-2"],
          }),
        },
      );

      const response = await bulkDeleteOrders(request);

      expect(response.status).toBe(500);
    });

    it("deve permitir deletar muitas ordens", async () => {
      const ids = Array.from({ length: 50 }, (_, i) => `order-${i + 1}`);

      mockedDelete.mockImplementation(async (id) =>
        createMockDeletedOrder(String(id)),
      );

      const request = new NextRequest(
        new URL("http://localhost:3000/api/admin/orders/bulk-delete"),
        {
          method: "DELETE",
          body: JSON.stringify({ ids }),
        },
      );

      const response = await bulkDeleteOrders(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalledTimes(ids.length);
    });
  });
});
