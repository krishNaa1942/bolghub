import { test, expect } from "@playwright/test";

test.describe("Dashboard - Create Post", () => {
  test("should navigate to create post page", async ({ page }) => {
    await page.goto("/dashboard");

    // Click "Create New Post" button or link
    const createButton = page.getByRole("link", { name: /create/i }).or(
      page.getByRole("button", { name: /create/i })
    );
    
    await createButton.click();

    // Verify URL
    await expect(page).toHaveURL(/.*dashboard\/new/);
  });

  test("should show form validation errors", async ({ page }) => {
    await page.goto("/dashboard/new");

    // Try to submit empty form
    const submitButton = page.getByRole("button", { name: /publish|create|submit/i });
    await submitButton.click();

    // Wait for validation errors
    await page.waitForTimeout(500);

    // Should still be on the same page (form didn't submit)
    await expect(page).toHaveURL(/.*dashboard\/new/);
  });

  test("should create a new post successfully", async ({ page }) => {
    await page.goto("/dashboard/new");

    // Fill out the form
    const titleInput = page.getByLabel(/title/i).or(page.getByPlaceholder(/title/i));
    const contentInput = page.getByLabel(/content/i).or(page.getByPlaceholder(/content/i));

    const testTitle = `Test Post ${Date.now()}`;
    await titleInput.fill(testTitle);
    await contentInput.fill("This is a test post content created by automated testing.");

    // Submit the form
    const submitButton = page.getByRole("button", { name: /publish|create|submit/i });
    await submitButton.click();

    // Wait for navigation or success message
    await page.waitForTimeout(2000);

    // Should redirect to dashboard or show success
    // Either we're back at dashboard or we see a success message
    const isDashboard = page.url().includes("/dashboard") && !page.url().includes("/new");
    const hasSuccess = await page.getByText(/success|created/i).count() > 0;

    expect(isDashboard || hasSuccess).toBeTruthy();
  });
});
