import { describe, expect, it } from "vitest";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  isSafeMethod,
  validateCsrfTokens,
} from "@/lib/csrf.edge";

describe("csrf.edge constants", () => {
  it("exports expected cookie name", () => expect(CSRF_COOKIE_NAME).toBe("csrf-token"));
  it("exports expected header name", () => expect(CSRF_HEADER_NAME).toBe("x-csrf-token"));
});

describe("isSafeMethod() (edge)", () => {
  it.each(["GET", "HEAD", "OPTIONS"])("returns true for %s", (method) => {
    expect(isSafeMethod(method)).toBe(true);
  });

  it("is case-insensitive", () => expect(isSafeMethod("get")).toBe(true));

  it.each(["POST", "PUT", "DELETE", "PATCH"])("returns false for %s", (method) => {
    expect(isSafeMethod(method)).toBe(false);
  });
});

describe("validateCsrfTokens() (edge, async)", () => {
  it("returns true for identical tokens", async () => {
    const token = "a".repeat(64);
    expect(await validateCsrfTokens(token, token)).toBe(true);
  });

  it("returns false when cookie is undefined", async () => {
    expect(await validateCsrfTokens(undefined, "token")).toBe(false);
  });

  it("returns false when header is undefined", async () => {
    expect(await validateCsrfTokens("token", undefined)).toBe(false);
  });

  it("returns false for different-length tokens", async () => {
    expect(await validateCsrfTokens("short", "longer-token")).toBe(false);
  });

  it("returns false for different tokens of same length", async () => {
    expect(await validateCsrfTokens("a".repeat(64), "b".repeat(64))).toBe(false);
  });
});
