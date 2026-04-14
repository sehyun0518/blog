import { describe, expect, it } from "vitest";
import { capitalize, slugify, stripHtml, toTitleCase, truncate } from "../string.js";

describe("slugify()", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("hello")).toBe("hello");
  });

  it("throws for an empty string", () => {
    expect(() => slugify("")).toThrow();
  });
});

describe("truncate()", () => {
  it("returns the original string if shorter than maxLength", () => {
    expect(truncate("hello", { maxLength: 10 })).toBe("hello");
  });

  it("truncates at word boundary with ellipsis", () => {
    const result = truncate("Hello world foo", { maxLength: 11 });
    expect(result.length).toBeLessThanOrEqual(14);
    expect(result).toContain("Hello");
  });

  it("uses custom ellipsis", () => {
    const result = truncate("Hello world foo", { maxLength: 11, ellipsis: "---" });
    expect(result).toContain("---");
  });

  it("throws for empty string", () => {
    expect(() => truncate("")).toThrow();
  });
});

describe("capitalize()", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("leaves rest of string unchanged", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });

  it("throws for empty string", () => {
    expect(() => capitalize("")).toThrow();
  });
});

describe("toTitleCase()", () => {
  it("capitalizes major words", () => {
    expect(toTitleCase("the quick brown fox")).toBe("The Quick Brown Fox");
  });

  it("lowercases articles in the middle", () => {
    expect(toTitleCase("war and peace")).toBe("War and Peace");
  });

  it("always capitalizes first and last word", () => {
    expect(toTitleCase("hello and")).toBe("Hello And");
  });
});

describe("stripHtml()", () => {
  it("removes HTML tags", () => {
    expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });

  it("returns plain text unchanged", () => {
    expect(stripHtml("no tags here")).toBe("no tags here");
  });
});
