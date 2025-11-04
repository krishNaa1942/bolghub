import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * RSS Feed Generator
 * Generates an RSS 2.0 feed of published blog posts
 */
export async function GET() {
  try {
    // Fetch published posts
    const publishedPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(50); // Limit to 50 most recent posts

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloghub.vercel.app";
    const buildDate = new Date().toUTCString();

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BlogHub - Modern Blogging Platform</title>
    <link>${siteUrl}</link>
    <description>Professional blogging platform with markdown support and real-time previews</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${publishedPosts
      .map((post) => {
        const postUrl = `${siteUrl}/blog/${post.slug}`;
        const pubDate = post.createdAt ? new Date(post.createdAt).toUTCString() : buildDate;
        // Use first 200 chars of content as description
        const description = post.content?.substring(0, 200).replace(/<[^>]*>/g, '') || "";
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${description}...]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[RSS] Error generating feed:", error);
    
    // Return minimal RSS feed on error
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BlogHub</title>
    <link>https://bloghub.vercel.app</link>
    <description>Blog feed temporarily unavailable</description>
  </channel>
</rss>`,
      {
        headers: {
          "Content-Type": "application/xml",
        },
        status: 500,
      }
    );
  }
}
