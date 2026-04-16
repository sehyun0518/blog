import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("fs");

import fs from "fs";
import { buildLlmsTxt } from "@/lib/llms";

const MOCK_MDX: Record<string, string> = {
  "hello-world.mdx": [
    "---",
    'title: "Hello World"',
    'date: "2026-04-16"',
    'description: "First post on the blog"',
    "tags:",
    "  - general",
    "  - introduction",
    "---",
    "",
    "Content here.",
  ].join("\n"),
  "nextjs-app-router.mdx": [
    "---",
    'title: "Understanding Next.js App Router"',
    'date: "2026-04-10"',
    'description: "Deep dive into App Router"',
    "tags:",
    "  - nextjs",
    "---",
    "",
    "App Router content.",
  ].join("\n"),
};

function setupFsMocks() {
  vi.mocked(fs.existsSync).mockImplementation((p) => {
    const str = String(p);
    if (str.includes("content/posts")) return true;
    if (str.endsWith(".mdx")) {
      const filename = str.split("/").pop() ?? "";
      return filename in MOCK_MDX;
    }
    return false;
  });
  vi.mocked(fs.readdirSync).mockReturnValue(Object.keys(MOCK_MDX) as any);
  vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
    const filename = String(filePath).split("/").pop() ?? "";
    const content = MOCK_MDX[filename];
    if (!content) throw new Error(`File not found: ${String(filePath)}`);
    return content;
  });
}

describe("buildLlmsTxt()", () => {
  beforeEach(setupFsMocks);

  it("starts with the blog title as h1", () => {
    const txt = buildLlmsTxt();
    expect(txt.startsWith("# Blog")).toBe(true);
  });

  it("includes the site URL, feed, and sitemap links", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("URL:");
    expect(txt).toContain("Feed:");
    expect(txt).toContain("Sitemap:");
    expect(txt).toContain("feed.xml");
    expect(txt).toContain("sitemap.xml");
  });

  it("lists all posts", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("Hello World");
    expect(txt).toContain("Understanding Next.js App Router");
  });

  it("includes post URLs as markdown links", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("/posts/hello-world");
    expect(txt).toContain("/posts/nextjs-app-router");
    expect(txt).toMatch(/\[Hello World\]\(http[^)]+\/posts\/hello-world\)/);
  });

  it("includes post descriptions", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("First post on the blog");
    expect(txt).toContain("Deep dive into App Router");
  });

  it("includes tags in brackets", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("[general, introduction]");
    expect(txt).toContain("[nextjs]");
  });

  it("includes post dates", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("2026-04-16");
    expect(txt).toContain("2026-04-10");
  });

  it("has a Posts section heading", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("## Posts");
  });
});
