import type { User } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/requireAdmin");

vi.mock("@/sanity/lib/backendClient", () => ({
  backendClient: { create: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

vi.mock("@/sanity/lib/writeClient", () => ({
  writeClient: { create: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: vi.fn() },
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

const makeAdminUser = (): User =>
  ({
    id: "user_test_123",
    emailAddresses: [],
    firstName: "Admin",
  }) as unknown as User;

const makeDeletedOrder = (id: string) => ({
  _id: id,
  _rev: "rev-test",
  _type: "order",
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
});

const makeDeleteRequest = (url: string, body?: object) =>
  new NextRequest(new URL(url), {
    method: "DELETE",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

const mockedDelete = vi.mocked(backendClient.delete);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAdmin).mockResolvedValue(makeAdminUser());
});

describe("Orders API Endpoints", () => {
  describe("DELETE /api/admin/orders/[id]", () => {
    it("deleta ordem individual com sucesso", async () => {
      const orderId = "order-123";
      mockedDelete.mockImplementation(async () => makeDeletedOrder(orderId));

      const response = await deleteOrderById(
        makeDeleteRequest(`http://localhost:3000/api/admin/orders/${orderId}`),
        { params: Promise.resolve({ id: orderId }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalled();
    });

    it("retorna 401/403/500 quando não autorizado", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const response = await deleteOrderById(
        makeDeleteRequest("http://localhost:3000/api/admin/orders/order-123"),
        { params: Promise.resolve({ id: "order-123" }) },
      );

      expect([401, 403, 500]).toContain(response.status);
    });
  });

  describe("DELETE /api/admin/orders/bulk-delete", () => {
    const bulkUrl = "http://localhost:3000/api/admin/orders/bulk-delete";

    it("deleta múltiplas ordens com sucesso", async () => {
      const ids = ["order-1", "order-2", "order-3"];
      mockedDelete.mockImplementation(async (id) =>
        makeDeletedOrder(String(id)),
      );

      const response = await bulkDeleteOrders(
        makeDeleteRequest(bulkUrl, { ids }),
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalledTimes(ids.length);
    });

    it.each([
      [{ ids: [] }, "array vazio"],
      [{ ids: "order-1" }, "ids não é array"],
      [{}, "ids ausente"],
    ])("retorna 400 quando body é %s", async (body, _label) => {
      const response = await bulkDeleteOrders(makeDeleteRequest(bulkUrl, body));
      expect(response.status).toBe(400);
    });

    it("retorna 401/403 quando não autorizado", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Unauthorized"));

      const response = await bulkDeleteOrders(
        makeDeleteRequest(bulkUrl, { ids: ["order-1", "order-2"] }),
      );

      expect([401, 403]).toContain(response.status);
    });

    it("retorna 500 em caso de erro no banco", async () => {
      mockedDelete.mockRejectedValue(new Error("Database error"));

      const response = await bulkDeleteOrders(
        makeDeleteRequest(bulkUrl, { ids: ["order-1", "order-2"] }),
      );

      expect(response.status).toBe(500);
    });

    it("suporta deleção em larga escala (50 ordens)", async () => {
      const ids = Array.from({ length: 50 }, (_, i) => `order-${i + 1}`);
      mockedDelete.mockImplementation(async (id) =>
        makeDeletedOrder(String(id)),
      );

      const response = await bulkDeleteOrders(
        makeDeleteRequest(bulkUrl, { ids }),
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockedDelete).toHaveBeenCalledTimes(50);
    });
  });
});
