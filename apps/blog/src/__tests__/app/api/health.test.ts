import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns 200 status", () => {
    const req = new NextRequest("http://localhost/api/health");
    expect(GET(req).status).toBe(200);
  });

  it("returns ApiResponse with status: ok", async () => {
    const req = new NextRequest("http://localhost/api/health");
    const body = await GET(req).json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("ok");
  });

  it("includes a valid ISO timestamp", async () => {
    const before = new Date().toISOString();
    const req = new NextRequest("http://localhost/api/health");
    const body = await GET(req).json();
    const after = new Date().toISOString();
    expect(body.data.timestamp >= before).toBe(true);
    expect(body.data.timestamp <= after).toBe(true);
  });
});
