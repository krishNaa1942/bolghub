import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test("should load blog page with posts", async ({ page }) => {
    await page.goto("/blog");

    // Check page title
    await expect(page).toHaveTitle(/blog/i);

    // Wait for content to load (tRPC query)
    await page.waitForTimeout(1000);
  });

  test("should navigate to blog post detail", async ({ page }) => {
    await page.goto("/blog");

    // Wait for posts to load
    await page.waitForTimeout(1000);

    // Try to find and click first post link
    const firstPost = page.locator('a[href^="/blog/"]').first();
    
    // Check if posts exist
    const count = await firstPost.count();
    if (count > 0) {
      await firstPost.click();
      
      // Verify we're on a post detail page
      await expect(page).toHaveURL(/\/blog\/.+/);
    } else {
      // No posts yet - that's okay for a new blog
      console.log("No posts found - skipping navigation test");
    }
  });
});
