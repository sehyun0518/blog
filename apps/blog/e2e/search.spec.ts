import { expect, test } from "@playwright/test";

test.describe("Search", () => {
  test("updates URL with search query", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("TypeScript");
    await expect(page).toHaveURL(/q=TypeScript/);
  });

  test("shows matching posts", async ({ page }) => {
    await page.goto("/?q=TypeScript");
    await expect(
      page.getByRole("heading", { name: /TypeScript/i })
    ).toBeVisible();
  });

  test("shows no posts message for unmatched query", async ({ page }) => {
    await page.goto("/?q=xyzzyxyzzy");
    await expect(page.getByText(/no posts found/i)).toBeVisible();
  });

  test("fuzzy matching finds near-matches", async ({ page }) => {
    await page.goto("/?q=Typscript");
    await expect(
      page.getByRole("heading", { name: /TypeScript/i })
    ).toBeVisible();
  });

  test("combines tag filter and search query", async ({ page }) => {
    await page.goto("/?tag=typescript&q=generics");
    await expect(
      page.getByRole("heading", { name: /generics/i })
    ).toBeVisible();
  });

  test("restores query from URL on load", async ({ page }) => {
    await page.goto("/?q=vitest");
    const input = page.getByRole("searchbox");
    await expect(input).toHaveValue("vitest");
    await expect(
      page.getByRole("heading", { name: /vitest/i })
    ).toBeVisible();
  });

  test("clearing search returns to full post list", async ({ page }) => {
    await page.goto("/?q=typescript");
    await page.getByRole("searchbox").fill("");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Hello World" })).toBeVisible();
  });
});
