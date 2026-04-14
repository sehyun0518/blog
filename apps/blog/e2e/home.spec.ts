import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("loads successfully with 200 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("displays the welcome heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Welcome to the Blog"
    );
  });

  test("displays the Getting Started card", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /getting started/i })
    ).toBeVisible();
  });

  test("displays the Now live badge", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Now live")).toBeVisible();
  });

  test("displays the Read more button", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /read more/i })
    ).toBeVisible();
  });
});
