import { NextResponse } from "next/server";

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export function successResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data } as const;
}

export function errorResponse(error: unknown): ApiResponse<never> {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return { success: false, error: message } as const;
}

export function ok<T>(data: T, init?: ResponseInit): NextResponse<ApiResponse<T>> {
  return NextResponse.json(successResponse(data), { status: 200, ...init });
}

export function badRequest(message: string): NextResponse<ApiResponse<never>> {
  return NextResponse.json(errorResponse(new Error(message)), { status: 400 });
}

export function forbidden(message = "Forbidden"): NextResponse<ApiResponse<never>> {
  return NextResponse.json(errorResponse(new Error(message)), { status: 403 });
}

export function internalError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error("[api] Internal server error:", error);
  return NextResponse.json(
    errorResponse(new Error("Internal server error")),
    { status: 500 }
  );
}
