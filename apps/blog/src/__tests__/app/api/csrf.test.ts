import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/csrf/route";

describe("GET /api/csrf", () => {
  it("returns 200 status", () => {
    const req = new NextRequest("http://localhost/api/csrf");
    expect(GET(req).status).toBe(200);
  });

  it("returns a 64-char hex token in body", async () => {
    const req = new NextRequest("http://localhost/api/csrf");
    const body = await GET(req).json();
    expect(body.success).toBe(true);
    expect(body.data.token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("sets the csrf-token cookie", () => {
    const req = new NextRequest("http://localhost/api/csrf");
    const cookieHeader = GET(req).headers.get("set-cookie");
    expect(cookieHeader).toContain("csrf-token=");
  });

  it("sets the cookie as HttpOnly", () => {
    const req = new NextRequest("http://localhost/api/csrf");
    const cookieHeader = GET(req).headers.get("set-cookie") ?? "";
    expect(cookieHeader.toLowerCase()).toContain("httponly");
  });

  it("returns a unique token on each request", async () => {
    const body1 = await GET(new NextRequest("http://localhost/api/csrf")).json();
    const body2 = await GET(new NextRequest("http://localhost/api/csrf")).json();
    expect(body1.data.token).not.toBe(body2.data.token);
  });
});
