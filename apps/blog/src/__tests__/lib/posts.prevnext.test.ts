import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("fs");

import fs from "fs";
import { getPrevNextPosts, _clearPostCache } from "@/lib/posts";

const MOCK_MDX: Record<string, string> = {
  "post-a.mdx": [
    "---",
    'title: "Post A"',
    'date: "2026-04-16"',
    'description: "Newest"',
    "tags: []",
    "---",
    "Content A.",
  ].join("\n"),
  "post-b.mdx": [
    "---",
    'title: "Post B"',
    'date: "2026-04-10"',
    'description: "Middle"',
    "tags: []",
    "---",
    "Content B.",
  ].join("\n"),
  "post-c.mdx": [
    "---",
    'title: "Post C"',
    'date: "2026-04-01"',
    'description: "Oldest"',
    "tags: []",
    "---",
    "Content C.",
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

describe("getPrevNextPosts()", () => {
  beforeEach(() => { _clearPostCache(); setupFsMocks(); });

  it("returns null prev and null next for the only post", () => {
    vi.mocked(fs.readdirSync).mockReturnValue(["post-a.mdx"] as any);
    const { prev, next } = getPrevNextPosts("post-a");
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });

  it("returns no prev for the newest post", () => {
    const { next, prev } = getPrevNextPosts("post-a");
    expect(prev).not.toBeNull();
    expect(prev?.slug).toBe("post-b");
    expect(next).toBeNull();
  });

  it("returns no next for the oldest post", () => {
    const { prev, next } = getPrevNextPosts("post-c");
    expect(next).not.toBeNull();
    expect(next?.slug).toBe("post-b");
    expect(prev).toBeNull();
  });

  it("returns both prev and next for a middle post", () => {
    const { prev, next } = getPrevNextPosts("post-b");
    expect(prev?.slug).toBe("post-c");
    expect(next?.slug).toBe("post-a");
  });

  it("returns null for unknown slug", () => {
    const { prev, next } = getPrevNextPosts("unknown");
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });
});
