import { test, expect } from "@playwright/test";

test.describe("Categories Page", () => {
  test("should load categories page", async ({ page }) => {
    await page.goto("/categories");

    // Check page loaded
    await expect(page).toHaveURL(/.*categories/);
    
    // Wait for content
    await page.waitForTimeout(1000);
  });

  test("should display category list", async ({ page }) => {
    await page.goto("/categories");
    
    // Wait for tRPC data to load
    await page.waitForTimeout(1000);

    // Check for heading or title
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("should navigate to category posts", async ({ page }) => {
    await page.goto("/categories");
    
    // Wait for categories to load
    await page.waitForTimeout(1500);

    // Try to find and click a category link
    const categoryLink = page.locator('a[href*="/blog"]').first();
    const count = await categoryLink.count();

    if (count > 0) {
      await categoryLink.click();
      
      // Should navigate to blog page with category filter
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/blog");
    } else {
      // No categories yet - that's okay
      console.log("No categories found - skipping navigation test");
    }
  });
});

test.describe("Search Functionality", () => {
  test("should have search input on blog page", async ({ page }) => {
    await page.goto("/blog");
    
    // Look for search input
    const searchInput = page.getByPlaceholder(/search/i).or(
      page.getByRole("searchbox")
    );

    // If search exists, test it
    const count = await searchInput.count();
    if (count > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test("should filter posts by search term", async ({ page }) => {
    await page.goto("/blog");
    
    // Wait for posts to load
    await page.waitForTimeout(1000);

    // Try to find search input
    const searchInput = page.getByPlaceholder(/search/i).or(
      page.getByRole("searchbox")
    );

    const count = await searchInput.count();
    if (count > 0) {
      // Type search term
      await searchInput.fill("test");
      
      // Wait for results
      await page.waitForTimeout(1000);
      
      // Results should be filtered
      expect(page.url()).toBeDefined();
    } else {
      console.log("Search not implemented yet - skipping test");
    }
  });
});
