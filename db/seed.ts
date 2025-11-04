import { db, client } from "./index";
import { posts, categories, postCategories } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create categories
    const [tech, lifestyle, business] = await db
      .insert(categories)
      .values([
        {
          name: "Technology",
          description: "All about technology and innovation",
          slug: "technology",
        },
        {
          name: "Lifestyle",
          description: "Tips and tricks for better living",
          slug: "lifestyle",
        },
        {
          name: "Business",
          description: "Business insights and strategies",
          slug: "business",
        },
      ])
      .returning();

    console.log("✅ Categories created");

    // Create sample posts
    const [post1, post2, post3] = await db
      .insert(posts)
      .values([
        {
          title: "Getting Started with Next.js 15",
          content: `# Getting Started with Next.js 15

Next.js 15 introduces several exciting features that make building modern web applications even easier. In this post, we'll explore the new App Router and Server Components.

## What's New?

- **App Router**: A new way to structure your Next.js applications
- **Server Components**: Improved performance with server-side rendering
- **Turbopack**: Faster build times and hot module replacement

## Getting Started

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features enabled by default.

## Conclusion

Next.js 15 is a powerful framework that continues to evolve and improve. Give it a try for your next project!`,
          slug: "getting-started-with-nextjs-15",
          published: true,
        },
        {
          title: "10 Productivity Tips for Developers",
          content: `# 10 Productivity Tips for Developers

Boost your productivity with these essential tips for software developers.

## 1. Use Keyboard Shortcuts

Master keyboard shortcuts for your IDE and tools. This alone can save you hours each week.

## 2. Automate Repetitive Tasks

Use scripts and tools to automate tasks you do frequently.

## 3. Take Regular Breaks

The Pomodoro Technique can help maintain focus and prevent burnout.

## 4. Keep Learning

Stay updated with the latest technologies and best practices.

## 5. Write Clean Code

Invest time in writing maintainable, well-documented code.

## Conclusion

Implementing these tips will help you become a more efficient and effective developer.`,
          slug: "10-productivity-tips-for-developers",
          published: true,
        },
        {
          title: "The Future of Remote Work",
          content: `# The Future of Remote Work

Remote work is here to stay. Let's explore what the future holds.

## Current Trends

- Hybrid work models are becoming the norm
- Companies are investing in remote work infrastructure
- Digital collaboration tools are evolving rapidly

## Benefits of Remote Work

1. **Flexibility**: Work from anywhere
2. **Cost Savings**: No commute expenses
3. **Better Work-Life Balance**: More time for personal activities

## Challenges

Despite its benefits, remote work comes with challenges:

- Communication barriers
- Maintaining team culture
- Ensuring productivity

## Looking Ahead

The future of work will likely be a blend of remote and in-office experiences, giving employees the best of both worlds.`,
          slug: "the-future-of-remote-work",
          published: true,
        },
      ])
      .returning();

    console.log("✅ Posts created");

    // Assign categories to posts
    await db.insert(postCategories).values([
      { postId: post1!.id, categoryId: tech!.id },
      { postId: post2!.id, categoryId: tech!.id },
      { postId: post2!.id, categoryId: lifestyle!.id },
      { postId: post3!.id, categoryId: business!.id },
      { postId: post3!.id, categoryId: lifestyle!.id },
    ]);

    console.log("✅ Post categories assigned");
    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seed();
