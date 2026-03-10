/**
 * @file repositoryMocks.ts
 * Factories para mocks de repositórios e gateways de domínio.
 *
 * Evita redeclarar os mesmos objetos `vi.fn()` em categoryUseCases e productUseCases.
 *
 * Uso:
 *   import { makeCategoryRepositoryMock, makeProductRepositoryMock } from "@/tests/factories/repositoryMocks";
 */

import { vi } from "vitest";
import type { CategoryImageGateway } from "../../core/categories/CategoryImageGateway";
import type { CategoryRepository } from "../../core/categories/CategoryRepository";
import type { ProductImageGateway } from "../../core/products/ProductImageGateway";
import type { ProductRepository } from "../../core/products/ProductRepository";
import type { SlugGateway } from "../../core/products/SlugGateway";

// ─── Category ────────────────────────────────────────────────────────────────

export const makeCategoryRepositoryMock = (): CategoryRepository => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const makeCategoryImageGatewayMock = (): CategoryImageGateway => ({
  upload: vi.fn(),
});

// ─── Product ─────────────────────────────────────────────────────────────────

export const makeProductRepositoryMock = (): ProductRepository => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

export const makeProductImageGatewayMock = (): ProductImageGateway => ({
  uploadMany: vi.fn(),
});

// ─── Slug ────────────────────────────────────────────────────────────────────

export const makeSlugGatewayMock = (): SlugGateway => ({
  generate: vi.fn(),
});

/**
 * Factory para SlugService inline (usado em UpdateProduct).
 * Retorna um objeto compatível com o contrato esperado pelo use case.
 */
export const makeSlugServiceMock = (slug = "slug-gerado") => ({
  generate: vi.fn().mockResolvedValue(slug),
});

// ─── Sanity Image Reference ──────────────────────────────────────────────────

export const makeSanityImageRef = (ref = "image-ref-123", key = "img-1") => ({
  _key: key,
  _type: "image" as const,
  asset: {
    _type: "reference" as const,
    _ref: ref,
  },
});
