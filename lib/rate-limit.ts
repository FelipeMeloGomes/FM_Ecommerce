export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/admin/products": {
    limit: 30,
    windowMs: 15 * 60 * 1000,
  },
  "/api/admin/categories": {
    limit: 20,
    windowMs: 15 * 60 * 1000,
  },
  "/api/admin/brands": {
    limit: 20,
    windowMs: 15 * 60 * 1000,
  },
  "/api/admin/orders": {
    limit: 30,
    windowMs: 15 * 60 * 1000,
  },
  "/api/webhook": {
    limit: 50,
    windowMs: 15 * 60 * 1000,
  },
  "/api": {
    limit: 100,
    windowMs: 15 * 60 * 1000,
  },
};
