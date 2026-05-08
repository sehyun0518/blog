import { expect, test } from "@playwright/test";

test.describe("Like button", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so each test starts with a clean state
    await page.goto("/posts/hello-world");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("networkidle");
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
