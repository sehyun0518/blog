/**
 * Visitor identity — edge-safe (no Node.js built-ins).
 *
 * The visitor cookie is httpOnly so JavaScript cannot read it.
 * It is set by middleware on every page request and included
 * automatically by the browser on same-origin API requests.
 */

export const VISITOR_COOKIE_NAME = "vid" as const;
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function generateVisitorId(): string {
  return crypto.randomUUID();
}
