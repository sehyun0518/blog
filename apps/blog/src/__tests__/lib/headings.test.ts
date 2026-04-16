import { describe, it, expect } from "vitest";
import { extractHeadings } from "@/lib/headings";

describe("extractHeadings()", () => {
  it("returns empty array for content with no headings", () => {
    expect(extractHeadings("Just some paragraph text.")).toEqual([]);
  });

  it("extracts h2 headings", () => {
    const content = "## Hello World\n\nSome text.";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0]).toMatchObject({ level: 2, text: "Hello World", id: "hello-world" });
  });

  it("extracts h3 headings", () => {
    const content = "### Sub Section\n\nSome text.";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0]).toMatchObject({ level: 3, text: "Sub Section", id: "sub-section" });
  });

  it("does not extract h1 or h4+ headings", () => {
    const content = "# Title\n\n#### Deep heading\n\n## Included";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0]?.level).toBe(2);
  });

  it("preserves heading order", () => {
    const content = "## First\n\n### Second\n\n## Third";
    const headings = extractHeadings(content);
    expect(headings.map((h) => h.text)).toEqual(["First", "Second", "Third"]);
  });

  it("generates id from heading text", () => {
    const content = "## Hello World! (Example)";
    const headings = extractHeadings(content);
    expect(headings[0]?.id).toBe("hello-world-example");
  });

  it("ignores headings inside code blocks (inline backticks stripped)", () => {
    const content = "## `Code` Heading";
    const headings = extractHeadings(content);
    expect(headings[0]?.id).toBe("code-heading");
  });
});
