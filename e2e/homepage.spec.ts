import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/BlogHub/i);

    // Check main heading exists
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");

    // Check navigation exists
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /blog/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /categories/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
  });

  test("should navigate to blog page", async ({ page }) => {
    await page.goto("/");

    // Click blog link
    await page.getByRole("link", { name: /blog/i }).click();

    // Verify URL
    await expect(page).toHaveURL(/.*blog/);
  });
});
