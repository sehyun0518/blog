import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  isSafeMethod,
  validateCsrfTokens,
} from "@/lib/csrf.edge";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (!isSafeMethod(request.method)) {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME) ?? undefined;

    const valid = await validateCsrfTokens(cookieToken, headerToken);

    if (!valid) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid CSRF token" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return NextResponse.next();
}
