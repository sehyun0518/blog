import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("fs");

import fs from "fs";
import { buildFeed } from "@/lib/feed";
import { _clearPostCache } from "@/lib/posts";

const MOCK_MDX: Record<string, string> = {
  "hello-world.mdx": [
    "---",
    'title: "Hello World"',
    'date: "2026-04-16"',
    'description: "First post on the blog"',
    "tags:",
    "  - general",
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

describe("buildFeed()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns a valid RSS 2.0 XML string", () => {
    const feed = buildFeed();
    expect(feed).toContain('<?xml version="1.0"');
    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain("</rss>");
  });

  it("includes all post titles", () => {
    const feed = buildFeed();
    expect(feed).toContain("<title>Hello World</title>");
    expect(feed).toContain("<title>Understanding Next.js App Router</title>");
  });

  it("includes post descriptions", () => {
    const feed = buildFeed();
    expect(feed).toContain("First post on the blog");
    expect(feed).toContain("Deep dive into App Router");
  });

  it("includes post URLs as links and guids", () => {
    const feed = buildFeed();
    expect(feed).toContain("/posts/hello-world");
    expect(feed).toContain("/posts/nextjs-app-router");
  });

  it("includes post tags as categories", () => {
    const feed = buildFeed();
    expect(feed).toContain("<category>general</category>");
    expect(feed).toContain("<category>nextjs</category>");
  });

  it("escapes XML special characters in title", () => {
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const filename = String(filePath).split("/").pop() ?? "";
      if (filename === "hello-world.mdx") {
        return MOCK_MDX["hello-world.mdx"]!.replace(
          '"Hello World"',
          '"AT&T & <Friends>"'
        );
      }
      return MOCK_MDX[filename] ?? "";
    });
    const feed = buildFeed();
    expect(feed).toContain("AT&amp;T &amp; &lt;Friends&gt;");
    expect(feed).not.toContain("<Friends>");
  });

  it("includes atom:link self-reference", () => {
    const feed = buildFeed();
    expect(feed).toContain('rel="self"');
    expect(feed).toContain("feed.xml");
  });
});
