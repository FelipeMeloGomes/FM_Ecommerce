/**
 * @file sharedMocks.ts
 * Configurações de mock reutilizáveis para módulos externos.
 *
 * ⚠️  IMPORTANTE: Este arquivo documenta os padrões de mock e exporta
 * helpers de setup, mas os `vi.mock(...)` ainda precisam ser declarados
 * no topo de cada arquivo de teste (limitação do Vitest — hoisting).
 *
 * Use os helpers de SETUP (setupXxx) nos blocos `beforeEach` dos testes.
 *
 * Uso típico:
 *   // No arquivo de teste:
 *   vi.mock("@/lib/requireAdmin");
 *   beforeEach(() => setupRequireAdmin());
 */

import type { User } from "@clerk/nextjs/server";
import { vi } from "vitest";

// ─── requireAdmin ─────────────────────────────────────────────────────────────

/**
 * Cria um mock de User do Clerk para uso com requireAdmin.
 */
export const makeAdminUser = (overrides: Partial<User> = {}): User =>
  ({
    id: "admin_user_123",
    emailAddresses: [],
    firstName: "Admin",
    lastName: "Test",
    ...overrides,
  }) as unknown as User;

/**
 * Configura requireAdmin para resolver como admin autorizado (caso padrão).
 * Chame dentro de `beforeEach` após `vi.mock("@/lib/requireAdmin")`.
 */
export const setupRequireAdmin = (user = makeAdminUser()) => {
  const { requireAdmin } = require("@/lib/requireAdmin");
  vi.mocked(requireAdmin).mockResolvedValue(user);
};

/**
 * Configura requireAdmin para rejeitar (usuário não autorizado).
 */
export const setupRequireAdminUnauthorized = (
  message = "Apenas administradores podem acessar este recurso",
) => {
  const { requireAdmin } = require("@/lib/requireAdmin");
  vi.mocked(requireAdmin).mockRejectedValue(new Error(message));
};

// ─── Sanity Mocks ────────────────────────────────────────────────────────────

/**
 * Retorna o objeto padrão para o mock de SanityCategoryRepository e gateways.
 * Use como retorno do factory no vi.mock de @/services/categories.
 *
 * @example
 * vi.mock("@/services/categories", () => ({
 *   SanityCategoryRepository: vi.fn(() => makeSanityCategoryRepositoryMock()),
 *   SanityCategoryImageGateway: vi.fn(() => makeSanityCategoryImageGatewayMock()),
 * }));
 */
export const makeSanityCategoryRepositoryMock = () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const makeSanityCategoryImageGatewayMock = () => ({
  upload: vi.fn(),
});

export const makeSlugServiceInstanceMock = () => ({
  generate: vi.fn(async (title: string) =>
    title.toLowerCase().replace(/\s+/g, "-"),
  ),
});

// ─── HTTP Status helpers ──────────────────────────────────────────────────────

/**
 * Resolve o status HTTP esperado baseado na mensagem de erro.
 * Centraliza a lógica repetida em categoryAPI tests.
 */
export const resolveHttpStatus = (
  errorMessage: string | undefined,
  successStatus = 200,
): number => {
  if (!errorMessage) return successStatus;
  if (errorMessage === "Slug já existe") return 400;
  if (errorMessage === "Categoria não encontrada") return 404;
  if (errorMessage === "Produto não encontrado") return 404;
  return 500;
};

// ─── Webhook Request Builder ──────────────────────────────────────────────────

export interface WebhookRequestOptions {
  body?: object;
  signature?: string | null;
  url?: string;
}

/**
 * Cria um Request para testes de webhook, evitando repetição inline.
 *
 * @example
 * makeWebhookRequest({ body: { type: "checkout.session.completed" }, signature: "t=123,v1=abc" })
 * makeWebhookRequest({ signature: null }) // sem assinatura → deve retornar 400
 */
export const makeWebhookRequest = ({
  body = { type: "checkout.session.completed" },
  signature = "t=123456,v1=abc123",
  url = "http://localhost:3000/api/webhook",
}: WebhookRequestOptions = {}): Request => {
  const serializedBody = JSON.stringify(body);
  const headers: Record<string, string> = {};
  if (signature !== null) {
    headers["stripe-signature"] = signature;
  }
  return new Request(url, {
    method: "POST",
    body: serializedBody,
    headers,
  });
};

// ─── FormData Builders ───────────────────────────────────────────────────────

/**
 * Cria um FormData para testes de produto com valores padrão.
 * Mesma lógica de makeProductFormData em productsAPI.endpoints.test.ts,
 * agora centralizada.
 *
 * @example
 * makeProductFormData()
 * makeProductFormData({ status: "active", isFeatured: "true" })
 */
export const makeProductFormData = (
  overrides: Record<string, string> = {},
): FormData => {
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
