import { describe, expect, it } from "vitest";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  generateCsrfToken,
  isSafeMethod,
  validateCsrfTokens,
} from "@/lib/csrf";

describe("CSRF constants", () => {
  it("exports expected cookie name", () => {
    expect(CSRF_COOKIE_NAME).toBe("csrf-token");
  });

  it("exports expected header name", () => {
    expect(CSRF_HEADER_NAME).toBe("x-csrf-token");
  });
});

describe("generateCsrfToken()", () => {
  it("returns a 64-character hex string", () => {
    expect(generateCsrfToken()).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique tokens on each call", () => {
    expect(generateCsrfToken()).not.toBe(generateCsrfToken());
  });
});

describe("isSafeMethod()", () => {
  it.each(["GET", "HEAD", "OPTIONS"])("returns true for %s", (method) => {
    expect(isSafeMethod(method)).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isSafeMethod("get")).toBe(true);
  });

  it.each(["POST", "PUT", "DELETE", "PATCH"])("returns false for %s", (method) => {
    expect(isSafeMethod(method)).toBe(false);
  });
});

describe("validateCsrfTokens()", () => {
  it("returns true for matching tokens", () => {
    const token = generateCsrfToken();
    expect(validateCsrfTokens(token, token)).toBe(true);
  });

  it("returns false when cookie token is undefined", () => {
    expect(validateCsrfTokens(undefined, "token")).toBe(false);
  });

  it("returns false when header token is undefined", () => {
    expect(validateCsrfTokens("token", undefined)).toBe(false);
  });

  it("returns false for mismatched tokens", () => {
    expect(validateCsrfTokens(generateCsrfToken(), generateCsrfToken())).toBe(false);
  });

  it("returns false for tokens of different lengths", () => {
    expect(validateCsrfTokens("short", "longer-token")).toBe(false);
  });
});
