import { describe, it, expect } from "vitest";
import { readingTime } from "../reading-time";

describe("readingTime()", () => {
  it("returns at least 1 min read for short content", () => {
    expect(readingTime("Hello world")).toBe("1 min read");
  });

  it("calculates minutes based on 200 wpm", () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe("2 min read");
  });

  it("rounds to nearest minute", () => {
    const words = Array.from({ length: 250 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe("1 min read");
  });

  it("handles content with extra whitespace", () => {
    const content = "  word1   word2  \n  word3  ";
    expect(readingTime(content)).toBe("1 min read");
  });

  it("returns singular min for exactly 1 minute", () => {
    const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(" ");
    expect(readingTime(words)).toBe("1 min read");
  });
});
