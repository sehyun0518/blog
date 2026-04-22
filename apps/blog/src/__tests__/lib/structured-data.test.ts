import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildWebSiteSchema,
  buildBlogSchema,
  buildBlogPostingSchema,
} from "@/lib/structured-data";
import type { PostMeta } from "@/types/post";

const MOCK_POST: PostMeta = {
  slug: "hello-world",
  title: "Hello World",
  date: "2026-04-16",
  description: "First post",
  tags: ["general", "introduction"],
  readingTime: "1 min read",
  draft: false,
};

describe("buildWebSiteSchema()", () => {
  it("returns correct @type and @context", () => {
    const schema = buildWebSiteSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebSite");
  });

  it("includes name and url", () => {
    const schema = buildWebSiteSchema();
    expect(schema.name).toBe("Blog");
    expect(schema.url).toMatch(/^http/);
  });
});

describe("buildBlogSchema()", () => {
  it("returns correct @type", () => {
    const schema = buildBlogSchema();
    expect(schema["@type"]).toBe("Blog");
  });

  it("includes description", () => {
    const schema = buildBlogSchema();
    expect(typeof schema.description).toBe("string");
    expect(schema.description.length).toBeGreaterThan(0);
  });
});

describe("buildBlogPostingSchema()", () => {
  it("maps post fields correctly", () => {
    const schema = buildBlogPostingSchema(MOCK_POST);
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe(MOCK_POST.title);
    expect(schema.description).toBe(MOCK_POST.description);
    expect(schema.datePublished).toBe(MOCK_POST.date);
    expect(schema.keywords).toEqual(MOCK_POST.tags);
  });

  it("includes post URL", () => {
    const schema = buildBlogPostingSchema(MOCK_POST);
    expect(schema.url).toContain(MOCK_POST.slug);
  });

  it("includes inLanguage", () => {
    const schema = buildBlogPostingSchema(MOCK_POST);
    expect(schema.inLanguage).toBe("ko-KR");
  });

  it("includes mainEntityOfPage pointing to post URL", () => {
    const schema = buildBlogPostingSchema(MOCK_POST);
    expect(schema.mainEntityOfPage["@type"]).toBe("WebPage");
    expect(schema.mainEntityOfPage["@id"]).toContain(MOCK_POST.slug);
  });

  it("includes author and publisher", () => {
    const schema = buildBlogPostingSchema(MOCK_POST);
    expect(schema.author["@type"]).toBe("Person");
    expect(schema.publisher["@type"]).toBe("Organization");
  });
});
