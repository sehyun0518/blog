import { randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_BYTE_LENGTH = 32 as const;

export const CSRF_COOKIE_NAME = "csrf-token" as const;
export const CSRF_HEADER_NAME = "x-csrf-token" as const;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]) as ReadonlySet<string>;

export function generateCsrfToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
}

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase());
}

export function validateCsrfTokens(
  cookieToken: string | undefined,
  headerToken: string | undefined
): boolean {
  if (cookieToken === undefined || headerToken === undefined) return false;
  if (cookieToken.length !== headerToken.length) return false;

  const cookieBuf = Buffer.from(cookieToken, "utf8");
  const headerBuf = Buffer.from(headerToken, "utf8");

  try {
    return timingSafeEqual(cookieBuf, headerBuf);
  } catch {
    return false;
  }
}
