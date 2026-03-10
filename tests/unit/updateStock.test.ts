import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendClient } from "@/sanity/lib/backendClient";
import { updateStock } from "../../services/orders/updateStock";

vi.mock("@/sanity/lib/backendClient", () => ({
  backendClient: {
    getDocument: vi.fn(),
    patch: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnValue({ commit: vi.fn().mockResolvedValue(null) }),
    })),
  },
}));

describe("updateStock", () => {
  beforeEach(() => vi.clearAllMocks());

  it("decrementa o estoque corretamente para um produto", async () => {
    vi.mocked(backendClient.getDocument).mockResolvedValueOnce({
      stock: 10,
    } as never);

    await updateStock([{ productId: "prod-1", quantity: 3 }]);

    expect(backendClient.getDocument).toHaveBeenCalledWith("prod-1");
    expect(backendClient.patch).toHaveBeenCalled();
  });

  it("decrementa o estoque para múltiplos produtos em paralelo", async () => {
    vi.mocked(backendClient.getDocument)
      .mockResolvedValueOnce({ stock: 10 } as never)
      .mockResolvedValueOnce({ stock: 5 } as never);

    await updateStock([
      { productId: "prod-1", quantity: 2 },
      { productId: "prod-2", quantity: 3 },
    ]);

    expect(backendClient.getDocument).toHaveBeenCalledTimes(2);
    expect(backendClient.getDocument).toHaveBeenCalledWith("prod-1");
    expect(backendClient.getDocument).toHaveBeenCalledWith("prod-2");
    expect(backendClient.patch).toHaveBeenCalledTimes(2);
  });

  it("não lança erro quando productId não existe no Sanity", async () => {
    vi.mocked(backendClient.getDocument).mockResolvedValueOnce(null as never);

    await expect(
      updateStock([{ productId: "inexistente", quantity: 1 }]),
    ).resolves.not.toThrow();

    expect(backendClient.patch).not.toHaveBeenCalled();
  });

  it("não lança erro quando produto não tem estoque definido", async () => {
    vi.mocked(backendClient.getDocument).mockResolvedValueOnce({} as never);

    await expect(
      updateStock([{ productId: "prod-sem-stock", quantity: 1 }]),
    ).resolves.not.toThrow();

    expect(backendClient.patch).not.toHaveBeenCalled();
  });

  it("lança erro quando o patch do Sanity falha", async () => {
    vi.mocked(backendClient.getDocument).mockResolvedValueOnce({
      stock: 10,
    } as never);

    const patchMock = vi.mocked(backendClient.patch);
    patchMock.mockImplementationOnce(
      () =>
        ({
          set: vi.fn().mockReturnValue({
            commit: vi.fn().mockRejectedValue(new Error("Database error")),
          }),
        }) as never,
    );

    await expect(
      updateStock([{ productId: "prod-1", quantity: 3 }]),
    ).rejects.toThrow("Database error");
  });
});
