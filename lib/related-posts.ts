import type { Post } from "@/db/schema";

/**
 * Extended Post type with category info for related posts
 */
export type PostWithCategory = Post & {
  categoryId?: number;
  categoryName?: string;
};

/**
 * Calculate similarity score between two posts based on content
 */
function calculateSimilarity(post1: PostWithCategory, post2: PostWithCategory): number {
  let score = 0;

  // Same category = high relevance (if category data available)
  if (post1.categoryId && post2.categoryId && post1.categoryId === post2.categoryId) {
    score += 10;
  }

  // Title word matching (simple keyword overlap)
  const words1 = post1.title.toLowerCase().split(/\s+/);
  const words2 = post2.title.toLowerCase().split(/\s+/);
  const commonWords = words1.filter((w: string) => words2.includes(w) && w.length > 3);
  score += commonWords.length * 2;

  // Content similarity (basic keyword matching from first 500 chars)
  const content1 = post1.content.toLowerCase().substring(0, 500).split(/\s+/);
  const content2 = post2.content.toLowerCase().substring(0, 500).split(/\s+/);
  const commonContentWords = content1.filter(
    (w: string) => content2.includes(w) && w.length > 4
  );
  score += commonContentWords.length * 0.5;

  return score;
}

/**
 * Get related posts based on content similarity
 * @param currentPost - The current post to find related posts for
 * @param allPosts - All available posts to search through
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by relevance
 */
export function getRelatedPosts(
  currentPost: PostWithCategory,
  allPosts: PostWithCategory[],
  limit = 3
): PostWithCategory[] {
  // Filter out the current post and unpublished posts
  const candidates = allPosts.filter(
    (post) => post.id !== currentPost.id && post.published
  );

  // Calculate similarity scores
  const postsWithScores = candidates.map((post) => ({
    post,
    score: calculateSimilarity(currentPost, post),
  }));

  // Sort by score (descending) and limit results
  return postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Get recent posts from the same category
 */
export function getCategoryPosts(
  currentPost: PostWithCategory,
  allPosts: PostWithCategory[],
  limit = 3
): PostWithCategory[] {
  if (!currentPost.categoryId) {
    // If no category, return recent posts
    return allPosts
      .filter((post) => post.id !== currentPost.id && post.published)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  return allPosts
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        post.published &&
        post.categoryId === currentPost.categoryId
    )
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, limit);
}
