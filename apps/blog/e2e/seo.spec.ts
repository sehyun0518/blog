import { expect, test } from "@playwright/test";

test.describe("SEO & GEO routes", () => {
  test("sitemap.xml returns 200 with XML content", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("/posts/hello-world");
  });

  test("robots.txt returns 200 and allows crawlers", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-agent");
    expect(body).toContain("sitemap.xml");
  });

  test("feed.xml returns 200 with RSS content", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/rss+xml");
    const body = await response.text();
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<item>");
  });

  test("llms.txt returns 200 with plain text content", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/plain");
    const body = await response.text();
    expect(body).toContain("# Blog");
    expect(body).toContain("## Posts");
  });

  test("post page includes JSON-LD structured data", async ({ page }) => {
    await page.goto("/posts/hello-world");
    const ldJson = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(ldJson).not.toBeNull();
    const schema = JSON.parse(ldJson!);
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("Hello World");
  });

  test("home page includes WebSite JSON-LD", async ({ page }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const firstLd = await scripts.first().textContent();
    const schema = JSON.parse(firstLd!);
    expect(schema["@type"]).toBe("WebSite");
  });
});
