import { expect, test } from "@playwright/test";

test.describe("404 Not Found page", () => {
  test("returns 404 for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("displays the 404 heading", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  });

  test("shows a descriptive message", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(
      page.getByText(/찾을 수 없는 페이지/i)
    ).toBeVisible();
  });

  test("Return home link navigates to home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.getByRole("link", { name: /홈으로/i }).click();
    await expect(page).toHaveURL("/");
  });
});
