import { expect, test } from "@playwright/test";

test.describe("Like button", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies to reset the visitor ID so liked state is always false
    await context.clearCookies();
    await page.goto("/posts/hello-world");
    await page.locator("button[aria-label='Like this post']").waitFor({ state: "visible" });
  });

  test("is visible on post page", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Like this post" })).toBeVisible();
  });

  test("shows Liked label immediately after click", async ({ page }) => {
    await page.getByRole("button", { name: "Like this post" }).click();
    await expect(
      page.getByRole("button", { name: "Unlike this post" })
    ).toBeVisible();
  });

  test("button is not disabled after click", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Like this post" });
    await btn.click();
    const likedBtn = page.getByRole("button", { name: "Unlike this post" });
    await expect(likedBtn).not.toBeDisabled();
  });

  test("shows Unlike label after second click", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Like this post" });
    await btn.click();
    await page.getByRole("button", { name: "Unlike this post" }).click();
    await expect(page.getByRole("button", { name: "Like this post" })).toBeVisible();
  });
});
