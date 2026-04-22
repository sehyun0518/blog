import { expect, test } from "@playwright/test";

test.describe("Post detail page", () => {
  test("loads a post with 200 status", async ({ page }) => {
    const response = await page.goto("/posts/hello-world");
    expect(response?.status()).toBe(200);
  });

  test("displays the post title as h1", async ({ page }) => {
    await page.goto("/posts/hello-world");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hello World"
    );
  });

  test("displays the post description", async ({ page }) => {
    await page.goto("/posts/hello-world");
    await expect(
      page.getByText(/introduction to what this blog is about/i)
    ).toBeVisible();
  });

  test("displays post tags", async ({ page }) => {
    await page.goto("/posts/hello-world");
    await expect(page.getByText("general")).toBeVisible();
  });

  test("back link navigates to home", async ({ page }) => {
    await page.goto("/posts/hello-world");
    await page.getByRole("link", { name: /전체 포스트/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("returns 404 for unknown slug", async ({ page }) => {
    const response = await page.goto("/posts/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
