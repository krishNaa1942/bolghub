import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap() {
  const baseUrl = 'https://bloghub.vercel.app';

  // Base routes that are always available
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // Try to get published posts, but don't fail build if DB unavailable
  try {
    const allPosts = await db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(eq(posts.published, true));

    const postUrls = allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...routes, ...postUrls];
  } catch {
    // If DB is not available during build, return base routes only
    console.log('Sitemap: Database not available, returning base routes only');
    return routes;
  }
}
