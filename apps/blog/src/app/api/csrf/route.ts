import type { NextRequest, NextResponse } from "next/server";
import { CSRF_COOKIE_NAME, generateCsrfToken } from "@/lib/csrf";
import { ok } from "@/lib/api";

interface CsrfTokenPayload {
  readonly token: string;
}

/**
 * GET /api/csrf
 *
 * Issues a new CSRF token as an HttpOnly cookie and returns the token
 * value in the response body so the client can send it via X-CSRF-Token header.
 */
export function GET(_request: NextRequest): NextResponse<unknown> {
  const token = generateCsrfToken();

  const response = ok<CsrfTokenPayload>({ token });

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env["NODE_ENV"] === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
