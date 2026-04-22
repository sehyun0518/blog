import { describe, expect, it } from "vitest";
import { formatDate, formatRelativeDate, toISOString } from "../date.js";

const FIXED_DATE = new Date("2026-04-14T00:00:00.000Z");
const ISO_STRING = "2026-04-14T00:00:00.000Z";
const TIMESTAMP = FIXED_DATE.getTime();

describe("formatDate()", () => {
  it("formats a Date object with default format", () => {
    const result = formatDate(FIXED_DATE);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats an ISO string", () => {
    const result = formatDate(ISO_STRING, "yyyy-MM-dd");
    expect(result).toBe("2026-04-14");
  });

  it("formats a Unix timestamp", () => {
    const result = formatDate(TIMESTAMP, "yyyy-MM-dd");
    expect(result).toBe("2026-04-14");
  });

  it("formats a date-only string (YYYY-MM-DD)", () => {
    const result = formatDate("2026-04-16", "yyyy-MM-dd");
    expect(result).toBe("2026-04-16");
  });

  it("throws for an invalid date string", () => {
    expect(() => formatDate("not-a-date" as unknown as string)).toThrow();
  });

  it("throws for an empty format string", () => {
    expect(() => formatDate(FIXED_DATE, "")).toThrow();
  });
});

describe("formatRelativeDate()", () => {
  it("returns a string for a valid date", () => {
    const result = formatRelativeDate(FIXED_DATE);
    expect(typeof result).toBe("string");
  });

  it("includes suffix by default", () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const result = formatRelativeDate(past);
    // Korean locale: e.g., "1일 전" (1 day ago)
    expect(result).toMatch(/일\s*전$/);
  });
});

describe("toISOString()", () => {
  it("returns a valid ISO 8601 string", () => {
    const result = toISOString(FIXED_DATE);
    expect(result).toBe(ISO_STRING);
  });

  it("handles timestamps", () => {
    const result = toISOString(TIMESTAMP);
    expect(result).toBe(ISO_STRING);
  });
});
