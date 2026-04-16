import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("fs");

import fs from "fs";
import { getSeriesPosts, getRelatedPosts, getAllPostMeta, _clearPostCache } from "@/lib/posts";

const MOCK_MDX: Record<string, string> = {
  "part-1.mdx": [
    "---",
    'title: "Series Part 1"',
    'date: "2026-04-01"',
    'description: "Part 1"',
    "tags:",
    "  - react",
    "  - nextjs",
    'series: "Next.js Guide"',
    "seriesPart: 1",
    "---",
    "Content 1.",
  ].join("\n"),
  "part-2.mdx": [
    "---",
    'title: "Series Part 2"',
    'date: "2026-04-10"',
    'description: "Part 2"',
    "tags:",
    "  - react",
    "  - nextjs",
    'series: "Next.js Guide"',
    "seriesPart: 2",
    "---",
    "Content 2.",
  ].join("\n"),
  "standalone.mdx": [
    "---",
    'title: "Standalone Post"',
    'date: "2026-04-16"',
    'description: "No series"',
    "tags:",
    "  - react",
    "---",
    "Content standalone.",
  ].join("\n"),
  "unrelated.mdx": [
    "---",
    'title: "Unrelated Post"',
    'date: "2026-03-01"',
    'description: "No shared tags"',
    "tags:",
    "  - python",
    "---",
    "Content unrelated.",
  ].join("\n"),
};

function setupFsMocks() {
  vi.mocked(fs.existsSync).mockImplementation((p) => {
    const s = String(p);
    if (s.includes("content/posts")) return true;
    if (s.endsWith(".mdx")) return s.split("/").pop()! in MOCK_MDX;
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

describe("getSeriesPosts()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns posts in the series sorted by seriesPart", () => {
    const posts = getSeriesPosts("Next.js Guide");
    expect(posts).toHaveLength(2);
    expect(posts[0]?.slug).toBe("part-1");
    expect(posts[1]?.slug).toBe("part-2");
  });

  it("returns empty array for unknown series", () => {
    expect(getSeriesPosts("Unknown Series")).toEqual([]);
  });

  it("does not include posts from other series", () => {
    const posts = getSeriesPosts("Next.js Guide");
    expect(posts.every((p) => p.series === "Next.js Guide")).toBe(true);
  });
});

describe("getRelatedPosts()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns posts sharing tags, sorted by overlap score", () => {
    const related = getRelatedPosts("standalone");
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((p) => p.slug !== "standalone")).toBe(true);
  });

  it("excludes current post", () => {
    const related = getRelatedPosts("part-1");
    expect(related.every((p) => p.slug !== "part-1")).toBe(true);
  });

  it("returns empty array when no shared tags", () => {
    expect(getRelatedPosts("unrelated")).toEqual([]);
  });

  it("respects count limit", () => {
    const related = getRelatedPosts("part-1", 1);
    expect(related).toHaveLength(1);
  });
});

describe("draft filtering", () => {
  beforeEach(() => { _clearPostCache(); });

  it("excludes draft posts in production", () => {
    const draftMdx: Record<string, string> = {
      "draft-post.mdx": [
        "---",
        'title: "Draft Post"',
        'date: "2026-04-16"',
        'description: "Draft"',
        "draft: true",
        "tags: []",
        "---",
        "Draft content.",
      ].join("\n"),
      "published.mdx": [
        "---",
        'title: "Published"',
        'date: "2026-04-10"',
        'description: "Published"',
        "tags: []",
        "---",
        "Published content.",
      ].join("\n"),
    };
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(Object.keys(draftMdx) as any);
    vi.mocked(fs.readFileSync).mockImplementation((p) => {
      const f = String(p).split("/").pop() ?? "";
      return draftMdx[f] ?? "";
    });

    const posts = getAllPostMeta();
    expect(posts.every((p) => !p.draft)).toBe(true);
    expect(posts.some((p) => p.slug === "draft-post")).toBe(false);
  });
});
