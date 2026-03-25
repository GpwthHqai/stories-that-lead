/**
 * Lightweight in-memory rate limiter for Vercel serverless.
 *
 * Limits are per serverless instance (not globally shared across regions).
 * This provides per-IP abuse protection within each instance. For true
 * global rate limiting, upgrade to @upstash/ratelimit with Redis.
 *
 * Uses a sliding window algorithm with automatic cleanup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is within rate limits.
 *
 * @param key - Unique identifier (typically IP + route)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or window expired — allow and start new window
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, resetAt: now + config.windowMs };
  }

  // Within window — check count
  if (entry.count < config.limit) {
    entry.count++;
    return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
  }

  // Rate limited
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

/**
 * Extract client IP from request headers (works on Vercel).
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
