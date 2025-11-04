import { Redis } from "@upstash/redis";

// Create Redis client (reuse existing connection)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Cache utilities for improved performance
 */

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute - for frequently changing data
  MEDIUM: 300, // 5 minutes - for moderately changing data
  LONG: 3600, // 1 hour - for rarely changing data
  VERY_LONG: 86400, // 24 hours - for static data
};

/**
 * Get cached data or fetch and cache it
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // If no Redis configured, just fetch
  if (!redis) {
    return fetcher();
  }

  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    if (cached !== null) {
      console.log(`[CACHE HIT] ${key}`);
      return cached;
    }

    // Cache miss - fetch data
    console.log(`[CACHE MISS] ${key}`);
    const data = await fetcher();

    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(`[CACHE ERROR] ${key}:`, error);
    // On error, fall back to fetcher
    return fetcher();
  }
}

/**
 * Invalidate cache for a specific key
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(key);
    console.log(`[CACHE INVALIDATE] ${key}`);
  } catch (error) {
    console.error(`[CACHE INVALIDATE ERROR] ${key}:`, error);
  }
}

/**
 * Invalidate cache by pattern (e.g., "posts:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (!redis) return;

  try {
    // Get all keys matching pattern
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[CACHE INVALIDATE PATTERN] ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    console.error(`[CACHE INVALIDATE PATTERN ERROR] ${pattern}:`, error);
  }
}

/**
 * Generate cache key for posts list
 */
export function getPostsListCacheKey(params: {
  categoryId?: number;
  published?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): string {
  const parts = ["posts:list"];
  
  if (params.categoryId) parts.push(`cat:${params.categoryId}`);
  if (params.published !== undefined) parts.push(`pub:${params.published}`);
  if (params.search) parts.push(`search:${params.search}`);
  if (params.limit) parts.push(`limit:${params.limit}`);
  if (params.offset) parts.push(`offset:${params.offset}`);

  return parts.join(":");
}

/**
 * Generate cache key for single post
 */
export function getPostCacheKey(slug: string): string {
  return `post:${slug}`;
}

/**
 * Generate cache key for categories
 */
export function getCategoriesCacheKey(): string {
  return "categories:all";
}

/**
 * Warm up cache with frequently accessed data
 */
export async function warmupCache(): Promise<void> {
  if (!redis) {
    console.log("[CACHE] Redis not configured - skipping warmup");
    return;
  }

  console.log("[CACHE] Warming up cache...");
  // Cache warmup logic can be added here
  // For example: pre-fetch and cache popular posts
}
