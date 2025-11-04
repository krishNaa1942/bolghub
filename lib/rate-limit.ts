import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client (works in serverless)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiters for different operations
export const rateLimiters = {
  // Mutations: 10 requests per 10 seconds (prevents spam)
  mutation: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit/mutation",
      })
    : null,

  // Queries: 30 requests per 10 seconds (allows browsing)
  query: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit/query",
      })
    : null,

  // Strict: 5 requests per minute (for sensitive operations)
  strict: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/strict",
      })
    : null,
};

/**
 * Get identifier for rate limiting
 * In production, use user ID or session ID
 * For now, use IP address
 */
export function getIdentifier(req?: Request): string {
  if (!req) return "anonymous";
  
  // Try to get IP from various headers
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return "anonymous";
}

/**
 * Check rate limit and throw error if exceeded
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<void> {
  // If no limiter configured, skip rate limiting (development mode)
  if (!limiter) {
    return;
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  if (!success) {
    const resetDate = new Date(reset);
    const retryAfter = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
    
    throw new Error(
      `Rate limit exceeded. Try again in ${retryAfter} seconds. (Limit: ${limit}, Remaining: ${remaining})`
    );
  }
}
