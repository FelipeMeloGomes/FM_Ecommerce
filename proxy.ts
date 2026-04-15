import { clerkMiddleware } from "@clerk/nextjs/server";
import { createCsrfMiddleware } from "@csrf-armor/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEV_WHITELIST } from "./lib/dev-whitelist";
import { DEFAULT_RATE_LIMITS, type RateLimitConfig } from "./lib/rate-limit";

const useCsrfInProduction =
  process.env.CSRF_SECRET && process.env.NODE_ENV === "production";

if (useCsrfInProduction && !process.env.CSRF_SECRET) {
  throw new Error(
    "CSRF_SECRET environment variable is required when CSRF protection is enabled",
  );
}

type RateLimitKey = `${string}:${string}`;
type ClientIp = string;
type ApiPath = string;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

interface RateLimitStoreEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<RateLimitKey, RateLimitStoreEntry>();

const useCsrfProtection =
  process.env.NODE_ENV === "production" && !!process.env.CSRF_SECRET;

const createCsrf = () =>
  createCsrfMiddleware({
    strategy: useCsrfProtection ? "signed-double-submit" : "double-submit",
    secret: useCsrfProtection ? process.env.CSRF_SECRET : undefined,
    cookie: {
      name: "csrf-token",
      httpOnly: useCsrfProtection,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600 * 2,
    },
  });

const _csrfMiddleware = createCsrf();

const isApiRoute = (request: NextRequest): boolean => {
  return request.nextUrl.pathname.startsWith("/api");
};

const isAdminRoute = (path: string): boolean => {
  return path.startsWith("/api/admin");
};

const isWebhookRoute = (path: string): boolean => {
  return path.startsWith("/api/webhook");
};

const getClientIp = (request: NextRequest): ClientIp => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    return ip ?? "";
  }
  return request.headers.get("x-real-ip") ?? "";
};

const getRateLimitConfig = (path: ApiPath): RateLimitConfig => {
  for (const [pattern, config] of Object.entries(DEFAULT_RATE_LIMITS)) {
    if (path.startsWith(pattern)) {
      return config;
    }
  }
  return DEFAULT_RATE_LIMITS["/api"];
};

const createRateLimitEntry = (
  config: RateLimitConfig,
  now: number,
): RateLimitStoreEntry => {
  return {
    count: 1,
    resetTime: now + config.windowMs,
  };
};

const isWhitelisted = (ip: ClientIp): boolean => {
  return DEV_WHITELIST.includes(ip);
};

const isIpValid = (ip: ClientIp): boolean => {
  return ip !== "" && ip !== "unknown";
};

const isAllowed = (ip: ClientIp, path: ApiPath): RateLimitResult => {
  if (isWhitelisted(ip) || !isIpValid(ip)) {
    return {
      allowed: true,
      remaining: 999,
      resetTime: 0,
    };
  }

  const key = `${ip}:${path}` as RateLimitKey;
  const now = Date.now();
  const config = getRateLimitConfig(path);

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    const newEntry = createRateLimitEntry(config, now);
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  };
};

const cleanupExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

setInterval(cleanupExpiredEntries, 60 * 60 * 1000);

const addSecurityHeaders = (response: NextResponse): void => {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
};

const buildRateLimitResponse = (
  response: NextResponse,
  remaining: number,
  resetTime: number,
  config: RateLimitConfig,
): NextResponse => {
  addSecurityHeaders(response);
  response.headers.set("X-RateLimit-Limit", String(config.limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  if (resetTime > 0) {
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(resetTime / 1000)),
    );
  }
  return response;
};

export default clerkMiddleware(async (_auth, request: NextRequest) => {
  const path = request.nextUrl.pathname;

  if (isApiRoute(request)) {
    const ip = getClientIp(request);
    const { allowed, remaining, resetTime } = isAllowed(ip, path);
    const config = getRateLimitConfig(path);

    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000 / 60);
      const errorResponse = new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: `Limite de requisições excedido. Tente novamente em ${retryAfter} minutos.`,
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        },
      );
      addSecurityHeaders(errorResponse);
      return errorResponse;
    }

    const response = NextResponse.next();

    // CSRF validation for non-GET requests, excluding admin routes and webhooks (already protected by external service signature verification)
    if (
      request.method !== "GET" &&
      request.method !== "HEAD" &&
      !isAdminRoute(path) &&
      !isWebhookRoute(path)
    ) {
      const csrfResult = await _csrfMiddleware(request, response);
      if (!csrfResult.success) {
        const csrfErrorResponse = new NextResponse(
          JSON.stringify({ error: "Invalid CSRF token" }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
        addSecurityHeaders(csrfErrorResponse);
        return csrfErrorResponse;
      }
    }

    const result = buildRateLimitResponse(
      response,
      remaining,
      resetTime,
      config,
    );
    return result;
  }

  // Non-API routes (pages) - also add security headers
  const pageResponse = NextResponse.next();
  addSecurityHeaders(pageResponse);
  return pageResponse;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/api/:path*"],
};
