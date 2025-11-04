import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/db";
import superjson from "superjson";
import { rateLimiters, getIdentifier, checkRateLimit } from "@/lib/rate-limit";

// Create context for tRPC
export const createTRPCContext = async (opts: { headers: Headers; req?: Request }) => {
  const startTime = Date.now();
  
  return {
    db,
    startTime,
    req: opts.req,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error
            ? {
                message: error.cause.message,
                code: error.cause.name,
              }
            : null,
      },
    };
  },
});

// Middleware for logging and performance tracking
const timingMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (durationMs > 1000) {
    console.warn(
      `[SLOW QUERY] ${type} ${path} took ${durationMs}ms`
    );
  }

  return result;
});

// Rate limiting middleware for queries
const queryRateLimitMiddleware = t.middleware(async ({ ctx, next, type }) => {
  if (type === "query") {
    const identifier = getIdentifier(ctx.req);
    try {
      await checkRateLimit(identifier, rateLimiters.query);
    } catch (error) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: error instanceof Error ? error.message : "Rate limit exceeded",
      });
    }
  }
  return next();
});

// Rate limiting middleware for mutations
const mutationRateLimitMiddleware = t.middleware(async ({ ctx, next, type }) => {
  if (type === "mutation") {
    const identifier = getIdentifier(ctx.req);
    try {
      await checkRateLimit(identifier, rateLimiters.mutation);
    } catch (error) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: error instanceof Error ? error.message : "Rate limit exceeded",
      });
    }
  }
  return next();
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure
  .use(timingMiddleware)
  .use(queryRateLimitMiddleware)
  .use(mutationRateLimitMiddleware);
