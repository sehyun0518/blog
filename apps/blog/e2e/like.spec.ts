import { expect, test } from "@playwright/test";

test.describe("Like button", () => {
  test.beforeEach(async ({ page, context }) => {
    let liked = false;
    await page.route("**/api/likes/hello-world", async (route) => {
      if (route.request().method() === "POST") {
        liked = !liked;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { count: liked ? 1 : 0, liked },
        }),
      });
    });

    // Clear cookies to reset the visitor ID so liked state is always false
    await context.clearCookies();
    await page.goto("/posts/hello-world");
    await page.getByRole("button", { name: "좋아요", exact: true }).waitFor();
  });

  test("is visible on post page", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "좋아요", exact: true })
    ).toBeVisible();
  });

  test("shows unlike label immediately after click", async ({ page }) => {
    await page.getByRole("button", { name: "좋아요", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "좋아요 취소" })
    ).toBeVisible();
  });

  test("button is not disabled after click", async ({ page }) => {
    const btn = page.getByRole("button", { name: "좋아요", exact: true });
    await btn.click();
    const likedBtn = page.getByRole("button", { name: "좋아요 취소" });
    await expect(likedBtn).not.toBeDisabled();
  });

  test("shows like label after second click", async ({ page }) => {
    const btn = page.getByRole("button", { name: "좋아요", exact: true });
    const firstToggle = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/likes/hello-world") &&
        response.request().method() === "POST"
    );
    await btn.click();
    const firstResponse = await firstToggle;
    await firstResponse.finished();
    await page.waitForTimeout(50);

    await page.getByRole("button", { name: "좋아요 취소" }).click();
    await expect(
      page.getByRole("button", { name: "좋아요", exact: true })
    ).toBeVisible();
  });
});
