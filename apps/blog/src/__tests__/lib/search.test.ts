import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { searchPosts } from "@/lib/search";
import type { PostMeta } from "@/types/post";

const POSTS: PostMeta[] = [
  {
    slug: "typescript-generics",
    title: "TypeScript Generics Deep Dive",
    date: "2026-04-20",
    description: "Conditional types, mapped types, and template literal types.",
    tags: ["typescript", "types"],
    readingTime: "5 min read",
    draft: false,
  },
  {
    slug: "nextjs-app-router",
    title: "Understanding Next.js App Router",
    date: "2026-04-10",
    description: "Deep dive into Next.js 15 App Router and Server Components.",
    tags: ["nextjs", "react"],
    readingTime: "4 min read",
    draft: false,
  },
  {
    slug: "vitest-testing",
    title: "Testing Strategies with Vitest",
    date: "2026-04-14",
    description: "Unit, integration, and component tests in a monorepo.",
    tags: ["testing", "vitest"],
    readingTime: "6 min read",
    draft: false,
  },
];

describe("searchPosts()", () => {
  it("returns all posts for empty query", () => {
    expect(searchPosts(POSTS, "")).toHaveLength(3);
  });

  it("returns all posts for query shorter than 2 chars", () => {
    expect(searchPosts(POSTS, "t")).toHaveLength(3);
  });

  it("finds posts by title keyword", () => {
    const results = searchPosts(POSTS, "TypeScript");
    expect(results.some((p) => p.slug === "typescript-generics")).toBe(true);
  });

  it("finds posts by description keyword", () => {
    const results = searchPosts(POSTS, "Server Components");
    expect(results.some((p) => p.slug === "nextjs-app-router")).toBe(true);
  });

  it("finds posts by tag", () => {
    const results = searchPosts(POSTS, "vitest");
    expect(results.some((p) => p.slug === "vitest-testing")).toBe(true);
  });

  it("returns empty array when nothing matches", () => {
    const results = searchPosts(POSTS, "xxxxxxxxxx");
    expect(results).toHaveLength(0);
  });

  it("handles fuzzy matching for near-matches", () => {
    const results = searchPosts(POSTS, "Typscript");
    expect(results.some((p) => p.slug === "typescript-generics")).toBe(true);
  });
});
