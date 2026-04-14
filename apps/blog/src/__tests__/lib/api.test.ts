import { describe, expect, it } from "vitest";
import {
  successResponse,
  errorResponse,
  ok,
  badRequest,
  forbidden,
  internalError,
} from "@/lib/api";

describe("successResponse()", () => {
  it("returns success: true with data", () => {
    const result = successResponse({ id: 1 });
    expect(result).toStrictEqual({ success: true, data: { id: 1 } });
  });

  it("works with primitive data", () => {
    const result = successResponse("hello");
    expect(result.success).toBe(true);
    expect(result.data).toBe("hello");
  });
});

describe("errorResponse()", () => {
  it("returns success: false with Error message", () => {
    const result = errorResponse(new Error("oops"));
    expect(result).toStrictEqual({ success: false, error: "oops" });
  });

  it("returns generic message for non-Error values", () => {
    expect(errorResponse("string-error").error).toBe("An unexpected error occurred");
  });

  it("returns generic message for null", () => {
    expect(errorResponse(null).error).toBe("An unexpected error occurred");
  });
});

describe("ok()", () => {
  it("returns 200 with ApiResponse body", async () => {
    const res = ok({ value: 42 });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toStrictEqual({ success: true, data: { value: 42 } });
  });
});

describe("badRequest()", () => {
  it("returns 400 with error message", async () => {
    const res = badRequest("invalid input");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("invalid input");
  });
});

describe("forbidden()", () => {
  it("returns 403 with default message", async () => {
    const res = forbidden();
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden");
  });

  it("returns 403 with custom message", async () => {
    const res = forbidden("Access denied");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Access denied");
  });
});

describe("internalError()", () => {
  it("returns 500 response", async () => {
    const res = internalError(new Error("crash"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Internal server error");
  });
});
