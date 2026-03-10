/**
 * @file entityFactories.ts
 * Factories para entidades de domínio reutilizadas em múltiplos arquivos de teste.
 *
 * Uso:
 *   import { makeProduct, makeAddress, makeShipping } from "@/tests/factories/entityFactories";
 */

import type { ShippingQuote } from "../../core/shipping/ShippingQuote";
import type { Address, Product } from "../../sanity.types";

// ─── Product ────────────────────────────────────────────────────────────────

/**
 * Factory para Product (sanity.types).
 * Fornece valores padrão sensatos; passe overrides para personalizar.
 *
 * @example
 * makeProduct()                            // produto padrão
 * makeProduct({ _id: "p2", price: 200 })   // produto com id e preço custom
 */
export const makeProduct = (overrides: Partial<Product> = {}): Product =>
  ({
    _id: "p1",
    _type: "product",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: "Produto Teste",
    price: 100,
    discount: 10,
    images: [],
    ...overrides,
  }) as Product;

// ─── Address ────────────────────────────────────────────────────────────────

/**
 * Factory para Address (sanity.types).
 *
 * @example
 * makeAddress()                          // endereço padrão (default: true)
 * makeAddress({ default: false })        // endereço não-padrão
 */
export const makeAddress = (overrides: Partial<Address> = {}): Address =>
  ({
    _id: "addr-1",
    _type: "address",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: "Casa",
    address: "Rua Teste, 123",
    city: "Cidade",
    state: "ST",
    zip: "12345-678",
    default: true,
    createdAt: "",
    ...overrides,
  }) as Address;

// ─── ShippingQuote ───────────────────────────────────────────────────────────

/**
 * Factory para ShippingQuote.
 *
 * @example
 * makeShipping()                          // PAC padrão
 * makeShipping({ service: "SEDEX", price: 35.9, deliveryDays: 2 })
 */
export const makeShipping = (
  overrides: Partial<ShippingQuote> = {},
): ShippingQuote => ({
  service: "PAC",
  price: 25.9,
  deliveryDays: 5,
  ...overrides,
});

// ─── CartItem ────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Factory para item de carrinho.
 *
 * @example
 * makeCartItem()
 * makeCartItem({ product: makeProduct({ price: 200 }), quantity: 3 })
 */
export const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  product: makeProduct(),
  quantity: 1,
  ...overrides,
});
