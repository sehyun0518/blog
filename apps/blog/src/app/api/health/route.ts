import type { NextRequest, NextResponse } from "next/server";
import { ok, internalError } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";

interface HealthPayload {
  readonly status: string;
  readonly timestamp: string;
}

/**
 * GET /api/health
 *
 * Returns service health status. Used by load balancers and monitoring.
 */
export function GET(
  _request: NextRequest
): NextResponse<ApiResponse<HealthPayload>> {
  try {
    return ok<HealthPayload>({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return internalError(error);
  }
}
