import { describe, it, expect, vi } from "vitest";
import { checkRateLimit, getIdentifier } from "@/lib/rate-limit";
import type { Ratelimit } from "@upstash/ratelimit";

describe("Rate Limiting", () => {
  describe("getIdentifier", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const mockRequest = {
        headers: {
          get: vi.fn((header: string) => {
            if (header === "x-forwarded-for") return "192.168.1.1, 10.0.0.1";
            return null;
          }),
        },
      } as unknown as Request;

      const result = getIdentifier(mockRequest);
      expect(result).toBe("192.168.1.1");
    });

    it("should extract IP from x-real-ip header", () => {
      const mockRequest = {
        headers: {
          get: vi.fn((header: string) => {
            if (header === "x-real-ip") return "192.168.1.100";
            return null;
          }),
        },
      } as unknown as Request;

      const result = getIdentifier(mockRequest);
      expect(result).toBe("192.168.1.100");
    });

    it("should return 'anonymous' if no request provided", () => {
      const result = getIdentifier();
      expect(result).toBe("anonymous");
    });

    it("should return 'anonymous' if no IP headers found", () => {
      const mockRequest = {
        headers: {
          get: vi.fn(() => null),
        },
      } as unknown as Request;

      const result = getIdentifier(mockRequest);
      expect(result).toBe("anonymous");
    });
  });

  describe("checkRateLimit", () => {
    it("should pass when no limiter configured (development mode)", async () => {
      await expect(checkRateLimit("test-id", null)).resolves.toBeUndefined();
    });

    it("should throw error when rate limit exceeded", async () => {
      const mockLimiter = {
        limit: vi.fn().mockResolvedValue({
          success: false,
          limit: 10,
          reset: Date.now() + 5000,
          remaining: 0,
        }),
      };

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        checkRateLimit("test-id", mockLimiter as any)
      ).rejects.toThrow(/Rate limit exceeded/);
    });

    it("should pass when rate limit not exceeded", async () => {
      const mockLimiter = {
        limit: vi.fn().mockResolvedValue({
          success: true,
          limit: 10,
          reset: Date.now() + 10000,
          remaining: 5,
        }),
      };

      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        checkRateLimit("test-id", mockLimiter as any)
      ).resolves.toBeUndefined();
    });
  });
});
