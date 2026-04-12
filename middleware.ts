import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { DEV_WHITELIST } from "./lib/dev-whitelist";
import {
  DEFAULT_RATE_LIMITS,
  type RateLimitConfig,
  type RateLimitEntry,
} from "./lib/rate-limit";

type RateLimitKey = string;
type ClientIp = string;
type ApiPath = string;

interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetTime: number;
}

const rateLimitStore = new Map<RateLimitKey, RateLimitEntry>();

function isApiRoute(request: NextRequest): boolean {
  return request.nextUrl.pathname.startsWith("/api");
}

function getClientIp(request: NextRequest): ClientIp {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return (forwarded.split(",")[0]?.trim() ?? "") as ClientIp;
  }
  return (request.headers.get("x-real-ip") ?? "") as ClientIp;
}

function getRateLimitConfig(path: ApiPath): RateLimitConfig {
  for (const [pattern, config] of Object.entries(DEFAULT_RATE_LIMITS)) {
    if (path.startsWith(pattern)) {
      return config;
    }
  }
  return DEFAULT_RATE_LIMITS["/api"];
}

function createRateLimitEntry(
  config: RateLimitConfig,
  now: number,
): RateLimitEntry {
  return {
    count: 1,
    resetTime: now + config.windowMs,
  } as RateLimitEntry;
}

function isWhitelisted(ip: ClientIp): boolean {
  return DEV_WHITELIST.includes(ip);
}

function isIpValid(ip: ClientIp): boolean {
  return ip !== "" && ip !== "unknown";
}

function isAllowed(ip: ClientIp, path: ApiPath): RateLimitResult {
  if (isWhitelisted(ip) || !isIpValid(ip)) {
    return {
      allowed: true,
      remaining: 999,
      resetTime: 0,
    } as RateLimitResult;
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
    } as RateLimitResult;
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    } as RateLimitResult;
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetTime: entry.resetTime,
  } as RateLimitResult;
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupExpiredEntries, 60 * 60 * 1000);

async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const clerk = clerkMiddleware as (
    req: NextRequest,
    opts?: unknown,
  ) => Promise<NextResponse>;

  if (!isApiRoute(request)) {
    return clerk(request, {}) as Promise<NextResponse>;
  }

  const ip = getClientIp(request);
  const path = request.nextUrl.pathname as ApiPath;

  const { allowed, remaining, resetTime } = isAllowed(ip, path);

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Limite de requisições excedido. Tente novamente em ${retryAfter} minutos.`,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(getRateLimitConfig(path).limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetTime / 1000)),
          "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
        },
      },
    );
  }

  const response = await clerk(request);

  const clonedResponse = new NextResponse(response.body, response);

  const config = getRateLimitConfig(path);
  clonedResponse.headers.set("X-RateLimit-Limit", String(config.limit));
  clonedResponse.headers.set("X-RateLimit-Remaining", String(remaining));
  if (resetTime > 0) {
    clonedResponse.headers.set(
      "X-RateLimit-Reset",
      String(Math.ceil(resetTime / 1000)),
    );
  }

  return clonedResponse;
}

export default authMiddleware;
