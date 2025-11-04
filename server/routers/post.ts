import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postCategories } from "@/db/schema";
import { eq, desc, and, inArray, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { 
  getCached, 
  invalidateCachePattern, 
  getPostsListCacheKey, 
  getPostCacheKey,
  CACHE_TTL 
} from "@/lib/cache";

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number().positive()).optional(),
});

const updatePostSchema = z.object({
  id: z.number().positive("Invalid post ID"),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number().positive()).optional(),
});

export const postRouter = createTRPCRouter({
  // Get all posts with pagination, filtering, and search
  getAll: publicProcedure
    .input(
      z
        .object({
          categoryId: z.number().optional(),
          published: z.boolean().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input = {} }) => {
      const { categoryId, published, search, limit, offset } = input;

      // Generate cache key
      const cacheKey = getPostsListCacheKey(input);

      // Try to get from cache
      return getCached(
        cacheKey,
        async () => {
          // Build base query
          const whereConditions: Parameters<typeof and> = [];

          if (categoryId) {
            const postIds = await ctx.db
              .select({ postId: postCategories.postId })
              .from(postCategories)
              .where(eq(postCategories.categoryId, categoryId));

            const ids = postIds.map((p) => p.postId);
            if (ids.length === 0) return { posts: [], total: 0 };
            whereConditions.push(inArray(posts.id, ids));
          }

          if (published !== undefined) {
            whereConditions.push(eq(posts.published, published));
          }

          if (search) {
            whereConditions.push(ilike(posts.title, `%${search}%`));
          }

          const conditions =
            whereConditions.length > 0 ? and(...whereConditions) : undefined;

          // Get total count
          const [{ count }] = await ctx.db
            .select({ count: posts.id })
            .from(posts)
            .where(conditions)
            .then((r) => (r.length > 0 ? [{ count: r.length }] : [{ count: 0 }]));

          // Get paginated results
          const result = await ctx.db
            .select()
            .from(posts)
            .where(conditions)
            .orderBy(desc(posts.createdAt))
            .limit(limit || 20)
            .offset(offset || 0);

          return { posts: result, total: count };
        },
        CACHE_TTL.MEDIUM // Cache for 5 minutes
      );
    }),

  // Get a single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (!input.slug.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Slug cannot be empty",
        });
      }

      // Generate cache key
      const cacheKey = getPostCacheKey(input.slug);

      // Try to get from cache
      return getCached(
        cacheKey,
        async () => {
          const post = await ctx.db.query.posts.findFirst({
            where: eq(posts.slug, input.slug),
            with: {
              postCategories: {
                with: {
                  category: true,
                },
              },
            },
          });

          if (!post) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Post with slug "${input.slug}" not found`,
            });
          }

          return post;
        },
        CACHE_TTL.LONG // Cache for 1 hour
      );
    }),

  // Get a single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number().positive() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with ID ${input.id} not found`,
        });
      }

      return post;
    }),

  // Create a new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Check for duplicate slug
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, slugify(input.title, { lower: true, strict: true })),
      });

      if (existingPost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this title already exists",
        });
      }

      const slug = slugify(input.title, { lower: true, strict: true });

      const [post] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          published: input.published,
        })
        .returning();

      // Add categories if provided
      if (input.categoryIds && input.categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: post.id,
            categoryId,
          }))
        );
      }

      // Invalidate posts list cache
      await invalidateCachePattern("posts:list:*");

      return post;
    }),

  // Update a post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify post exists
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with ID ${input.id} not found`,
        });
      }

      const updateData: Partial<{
        title: string;
        content: string;
        slug: string;
        published: boolean;
        updatedAt: Date;
      }> = {
        updatedAt: new Date(),
      };

      if (input.title) {
        updateData.title = input.title;
        updateData.slug = slugify(input.title, { lower: true, strict: true });
      }
      if (input.content !== undefined) updateData.content = input.content;
      if (input.published !== undefined) updateData.published = input.published;

      const [post] = await ctx.db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, input.id))
        .returning();

      // Update categories if provided
      if (input.categoryIds !== undefined) {
        // Delete existing categories
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, input.id));

        // Add new categories
        if (input.categoryIds.length > 0) {
          await ctx.db.insert(postCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      }

      return post;
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.number().positive() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with ID ${input.id} not found`,
        });
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true, deletedId: input.id };
    }),

  // Get posts by category with details
  getByCategoryId: publicProcedure
    .input(z.object({ categoryId: z.number().positive(), limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ ctx, input }) => {
      const categoryPosts = await ctx.db.query.postCategories.findMany({
        where: eq(postCategories.categoryId, input.categoryId),
        with: {
          post: true,
        },
        limit: input.limit,
      });

      return categoryPosts.map((pc) => pc.post);
    }),
});
