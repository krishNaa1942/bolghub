import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { categories, postCategories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500).optional(),
});

const updateCategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));
    return allCategories;
  }),

  // Get a single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // Get a single category by ID with post count
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
        with: {
          postCategories: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // Create a new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Check for duplicate slug
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, slugify(input.name, { lower: true, strict: true })),
      });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this name already exists",
        });
      }

      const slug = slugify(input.name, { lower: true, strict: true });

      const [category] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description || null,
          slug,
        })
        .returning();

      return category;
    }),

  // Update a category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Verify category exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Category with ID ${input.id} not found`,
        });
      }

      const updateData: Partial<{
        name: string;
        slug: string;
        description: string | null;
        updatedAt: Date;
      }> = {
        updatedAt: new Date(),
      };

      if (input.name) {
        updateData.name = input.name;
        updateData.slug = slugify(input.name, { lower: true, strict: true });
      }
      if (input.description !== undefined) {
        updateData.description = input.description || null;
      }

      const [category] = await ctx.db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();

      return category;
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),

  // Get posts by category
  getPostsByCategory: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.query.postCategories.findMany({
        where: eq(postCategories.categoryId, input.categoryId),
        with: {
          post: true,
        },
      });

      return posts.map((pc) => pc.post);
    }),
});
