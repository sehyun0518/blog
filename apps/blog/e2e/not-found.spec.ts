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
      page.getByText(/the page you are looking for does not exist/i)
    ).toBeVisible();
  });

  test("Return home link navigates to home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await page.getByRole("link", { name: /return home/i }).click();
    await expect(page).toHaveURL("/");
  });
});
