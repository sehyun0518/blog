import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/likes", () => ({
  getLikeData: vi.fn(),
  toggleLike: vi.fn(),
}));

import { GET, POST } from "@/app/api/likes/[slug]/route";
import { getLikeData, toggleLike } from "@/lib/likes";

const VISITOR_COOKIE = "vid=test-visitor-uuid";
const CSRF_COOKIE = "csrf-token=test-csrf-token";

function makeContext(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function makeGetRequest(slug: string, cookies = `${VISITOR_COOKIE}`) {
  return new NextRequest(`http://localhost/api/likes/${slug}`, {
    headers: { cookie: cookies },
  });
}

function makePostRequest(slug: string, cookies = `${VISITOR_COOKIE}; ${CSRF_COOKIE}`) {
  return new NextRequest(`http://localhost/api/likes/${slug}`, {
    method: "POST",
    headers: {
      cookie: cookies,
      "x-csrf-token": "test-csrf-token",
      "content-type": "application/json",
    },
  });
}

describe("GET /api/likes/[slug]", () => {
  beforeEach(() => {
    vi.mocked(getLikeData).mockResolvedValue({ count: 5, liked: false });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with count and liked state", async () => {
    const res = await GET(makeGetRequest("hello-world"), makeContext("hello-world"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual({ count: 5, liked: false });
  });

  it("returns 400 for invalid slug", async () => {
    const res = await GET(
      makeGetRequest("../etc/passwd"),
      makeContext("../etc/passwd")
    );
    expect(res.status).toBe(400);
  });

  it("passes visitor id from cookie to getLikeData", async () => {
    await GET(makeGetRequest("test-post"), makeContext("test-post"));
    expect(getLikeData).toHaveBeenCalledWith("test-post", "test-visitor-uuid");
  });

  it("falls back to anonymous when vid cookie is missing", async () => {
    await GET(
      makeGetRequest("test-post", ""),
      makeContext("test-post")
    );
    expect(getLikeData).toHaveBeenCalledWith("test-post", "anonymous");
  });
});

describe("POST /api/likes/[slug]", () => {
  beforeEach(() => {
    vi.mocked(toggleLike).mockResolvedValue({ count: 6, liked: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with updated count and liked state", async () => {
    const res = await POST(makePostRequest("hello-world"), makeContext("hello-world"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual({ count: 6, liked: true });
  });

  it("returns 403 when CSRF token is missing", async () => {
    const req = new NextRequest("http://localhost/api/likes/hello-world", {
      method: "POST",
      headers: { cookie: VISITOR_COOKIE },
    });
    const res = await POST(req, makeContext("hello-world"));
    expect(res.status).toBe(403);
  });

  it("returns 403 when CSRF token does not match cookie", async () => {
    const req = new NextRequest("http://localhost/api/likes/hello-world", {
      method: "POST",
      headers: {
        cookie: `${VISITOR_COOKIE}; csrf-token=real-token`,
        "x-csrf-token": "wrong-token",
      },
    });
    const res = await POST(req, makeContext("hello-world"));
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid slug", async () => {
    const res = await POST(
      makePostRequest("../etc/passwd"),
      makeContext("../etc/passwd")
    );
    expect(res.status).toBe(400);
  });

  it("calls toggleLike with visitor id from cookie", async () => {
    await POST(makePostRequest("test-post"), makeContext("test-post"));
    expect(toggleLike).toHaveBeenCalledWith("test-post", "test-visitor-uuid");
  });
});
