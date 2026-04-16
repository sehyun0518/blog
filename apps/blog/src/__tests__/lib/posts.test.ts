import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("fs");

import fs from "fs";
import { getAllPostMeta, getPostBySlug, getAllTags, getAllSlugs, _clearPostCache } from "@/lib/posts";

const MOCK_MDX = {
  "hello-world.mdx": [
    "---",
    'title: "Hello World"',
    'date: "2026-04-16"',
    'description: "First post"',
    "tags:",
    "  - general",
    "  - introduction",
    "---",
    "",
    "Hello World content.",
  ].join("\n"),
  "nextjs-app-router.mdx": [
    "---",
    'title: "Understanding Next.js App Router"',
    'date: "2026-04-10"',
    'description: "Deep dive into App Router"',
    "tags:",
    "  - nextjs",
    "  - react",
    "---",
    "",
    "App Router content.",
  ].join("\n"),
  "no-tags.mdx": [
    "---",
    'title: "No Tags Post"',
    'date: "2026-04-01"',
    'description: "A post without tags"',
    "tags: []",
    "---",
    "",
    "No tags here.",
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
    const content = MOCK_MDX[filename as keyof typeof MOCK_MDX];
    if (!content) throw new Error(`File not found: ${String(filePath)}`);
    return content;
  });
}

describe("getAllPostMeta()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns all posts", () => {
    const posts = getAllPostMeta();
    expect(posts).toHaveLength(3);
  });

  it("sorts posts by date descending", () => {
    const posts = getAllPostMeta();
    expect(posts[0]?.slug).toBe("hello-world");
    expect(posts[1]?.slug).toBe("nextjs-app-router");
    expect(posts[2]?.slug).toBe("no-tags");
  });

  it("parses frontmatter correctly", () => {
    const posts = getAllPostMeta();
    const post = posts.find((p) => p.slug === "hello-world");
    expect(post).toMatchObject({
      slug: "hello-world",
      title: "Hello World",
      date: "2026-04-16",
      description: "First post",
      tags: ["general", "introduction"],
    });
  });

  it("includes readingTime in post meta", () => {
    const posts = getAllPostMeta();
    const post = posts.find((p) => p.slug === "hello-world");
    expect(post?.readingTime).toMatch(/^\d+ min read$/);
  });

  it("normalizes tags to lowercase", () => {
    const raw = MOCK_MDX["hello-world.mdx"]!.replace(
      "  - general\n  - introduction",
      "  - General\n  - Introduction"
    );
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const filename = String(filePath).split("/").pop() ?? "";
      if (filename === "hello-world.mdx") return raw;
      return MOCK_MDX[filename as keyof typeof MOCK_MDX] ?? "";
    });
    const posts = getAllPostMeta();
    const post = posts.find((p) => p.slug === "hello-world");
    expect(post?.tags).toEqual(["general", "introduction"]);
  });

  it("skips malformed posts without crashing", () => {
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      const filename = String(filePath).split("/").pop() ?? "";
      if (filename === "hello-world.mdx") throw new Error("disk error");
      return MOCK_MDX[filename as keyof typeof MOCK_MDX] ?? "";
    });
    const posts = getAllPostMeta();
    expect(posts.every((p) => p.slug !== "hello-world")).toBe(true);
    expect(posts.length).toBe(2);
  });

  it("returns empty array when posts directory does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllPostMeta()).toEqual([]);
  });
});

describe("getPostBySlug()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns post with content for a valid slug", () => {
    const post = getPostBySlug("hello-world");
    expect(post).not.toBeNull();
    expect(post?.slug).toBe("hello-world");
    expect(post?.content).toContain("Hello World content.");
  });

  it("returns null for an unknown slug", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getPostBySlug("does-not-exist")).toBeNull();
  });

  it("returns null for path traversal slugs", () => {
    expect(getPostBySlug("../etc/passwd")).toBeNull();
    expect(getPostBySlug("..\\windows\\system32")).toBeNull();
    expect(getPostBySlug("hello/world")).toBeNull();
  });

  it("includes all frontmatter fields", () => {
    const post = getPostBySlug("nextjs-app-router");
    expect(post).toMatchObject({
      title: "Understanding Next.js App Router",
      date: "2026-04-10",
      description: "Deep dive into App Router",
      tags: ["nextjs", "react"],
    });
  });
});

describe("getAllTags()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns unique tags sorted alphabetically", () => {
    const tags = getAllTags();
    expect(tags).toEqual(["general", "introduction", "nextjs", "react"]);
  });

  it("excludes duplicates across posts", () => {
    const tags = getAllTags();
    const unique = new Set(tags);
    expect(tags.length).toBe(unique.size);
  });
});

describe("getAllSlugs()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns all slugs without file extension", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("hello-world");
    expect(slugs).toContain("nextjs-app-router");
    expect(slugs.every((s) => !s.includes("."))).toBe(true);
  });

  it("returns empty array when directory does not exist", () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    expect(getAllSlugs()).toEqual([]);
  });
});
