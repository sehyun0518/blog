/**
 * Edge-safe CSRF utilities — no Node.js built-ins.
 * Used by middleware (Edge runtime) only.
 */

export const CSRF_COOKIE_NAME = "csrf-token" as const;
export const CSRF_HEADER_NAME = "x-csrf-token" as const;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]) as ReadonlySet<string>;

export function isSafeMethod(method: string): boolean {
  return SAFE_METHODS.has(method.toUpperCase());
}

/**
 * Compares two tokens using a timing-safe approach via Web Crypto API (Edge-compatible).
 */
export async function validateCsrfTokens(
  cookieToken: string | undefined,
  headerToken: string | undefined
): Promise<boolean> {
  if (cookieToken === undefined || headerToken === undefined) return false;
  if (cookieToken.length !== headerToken.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(cookieToken);
  const b = encoder.encode(headerToken);

  const key = await crypto.subtle.importKey(
    "raw",
    a,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, a),
    crypto.subtle.sign("HMAC", key, b),
  ]);

  const viewA = new Uint8Array(sigA);
  const viewB = new Uint8Array(sigB);

  return viewA.every((byte, i) => byte === viewB[i]);
}
