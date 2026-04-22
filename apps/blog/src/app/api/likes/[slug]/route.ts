import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ok, badRequest, forbidden, internalError } from "@/lib/api";
import { getLikeData, toggleLike } from "@/lib/likes";
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, validateCsrfTokens } from "@/lib/csrf";
import { VISITOR_COOKIE_NAME } from "@/lib/visitor";
import type { ApiResponse } from "@/lib/api";
import type { LikeData } from "@/lib/likes";

const SlugSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug");

type RouteContext = { params: Promise<{ slug: string }> };

function getVisitorId(request: NextRequest): string {
  return request.cookies.get(VISITOR_COOKIE_NAME)?.value ?? "anonymous";
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<LikeData>>> {
  try {
    const { slug } = await context.params;
    const parsed = SlugSchema.safeParse(slug);
    if (!parsed.success) return badRequest("Invalid slug");

    const visitorId = getVisitorId(request);
    const data = await getLikeData(parsed.data, visitorId);
    return ok<LikeData>(data);
  } catch (error) {
    return internalError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<LikeData>>> {
  try {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME) ?? undefined;
    const valid = validateCsrfTokens(cookieToken, headerToken);
    if (!valid) return forbidden("Invalid CSRF token");

    const { slug } = await context.params;
    const slugParsed = SlugSchema.safeParse(slug);
    if (!slugParsed.success) return badRequest("Invalid slug");

    const visitorId = getVisitorId(request);
    const data = await toggleLike(slugParsed.data, visitorId);
    return ok<LikeData>(data);
  } catch (error) {
    return internalError(error);
  }
}
