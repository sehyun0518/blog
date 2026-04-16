import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("loads successfully with 200 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("displays the blog heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Blog");
  });

  test("displays a list of posts", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("list")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hello World" })
    ).toBeVisible();
  });

  test("displays tag filter buttons", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "general" })).toBeVisible();
  });

  test("filters posts by tag and updates URL", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "nextjs" }).click();
    await expect(page).toHaveURL("/?tag=nextjs");
    await expect(
      page.getByRole("heading", { name: /next\.js app router/i })
    ).toBeVisible();
  });

  test("clicking a post card navigates to the post detail page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("heading", { name: "Hello World" }).click();
    await expect(page).toHaveURL("/posts/hello-world");
  });
});
