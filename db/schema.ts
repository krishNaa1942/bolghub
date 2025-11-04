import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Indexes for common query patterns
  slugIdx: index("posts_slug_idx").on(table.slug),
  publishedIdx: index("posts_published_idx").on(table.published),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  publishedCreatedAtIdx: index("posts_published_created_at_idx").on(table.published, table.createdAt),
}));

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Post-Category junction table (many-to-many relationship)
export const postCategories = pgTable(
  "post_categories",
  {
    postId: serial("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: serial("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.categoryId] }),
    // Indexes for junction table queries
    postIdIdx: index("post_categories_post_id_idx").on(t.postId),
    categoryIdIdx: index("post_categories_category_id_idx").on(t.categoryId),
  })
);

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// Types
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type PostCategory = typeof postCategories.$inferSelect;
export type NewPostCategory = typeof postCategories.$inferInsert;
