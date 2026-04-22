// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "@/components/like-button";

function mockFetch({
  initialCount = 0,
  initialLiked = false,
  toggleCount = 1,
  toggleLiked = true,
}: {
  initialCount?: number;
  initialLiked?: boolean;
  toggleCount?: number;
  toggleLiked?: boolean;
} = {}) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
    const urlStr = String(url);
    const method = (init as RequestInit | undefined)?.method ?? "GET";

    if (urlStr.includes("/api/csrf")) {
      return new Response(
        JSON.stringify({ data: { token: "test-csrf-token" } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (urlStr.includes("/api/likes/")) {
      if (method === "POST") {
        return new Response(
          JSON.stringify({ data: { count: toggleCount, liked: toggleLiked } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ data: { count: initialCount, liked: initialLiked } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(null, { status: 404 });
  });
}

describe("LikeButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the button after mount", async () => {
    mockFetch();
    render(<LikeButton slug="test-post" />);
    await waitFor(() =>
      expect(screen.getByRole("button")).toBeInTheDocument()
    );
  });

  it("shows Like label when not liked", async () => {
    mockFetch({ initialLiked: false });
    render(<LikeButton slug="test-post" />);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Like this post" })
      ).toBeInTheDocument()
    );
  });

  it("shows Liked label when server reports already liked", async () => {
    mockFetch({ initialLiked: true, initialCount: 5 });
    render(<LikeButton slug="test-post" />);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Unlike this post" })
      ).toBeInTheDocument()
    );
  });

  it("displays like count from API", async () => {
    mockFetch({ initialCount: 42 });
    render(<LikeButton slug="test-post" />);
    await waitFor(() => expect(screen.getByText("42")).toBeInTheDocument());
  });

  it("hides count when count is zero", async () => {
    mockFetch({ initialCount: 0 });
    render(<LikeButton slug="test-post" />);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Like this post" })
      ).toBeInTheDocument()
    );
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("button is NOT disabled — optimistic update is immediate", async () => {
    mockFetch({ initialCount: 0, initialLiked: false });
    render(<LikeButton slug="test-post" />);
    await waitFor(() => expect(screen.getByRole("button")).toBeInTheDocument());
    // Button must never be disabled (no disabled:opacity-60 during API calls)
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("shows Liked instantly on click before API resolves", async () => {
    let resolvePost!: (r: Response) => void;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      const urlStr = String(url);
      const method = (init as RequestInit | undefined)?.method ?? "GET";
      if (urlStr.includes("/api/csrf")) {
        return new Response(JSON.stringify({ data: { token: "t" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (urlStr.includes("/api/likes/") && method === "POST") {
        // POST never resolves during this test
        return new Promise<Response>((resolve) => { resolvePost = resolve; });
      }
      return new Response(
        JSON.stringify({ data: { count: 3, liked: false } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    });

    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Like this post" })).toBeInTheDocument()
    );

    // Click — POST is unresolved, but Liked state should appear immediately
    user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Unlike this post" })
      ).toBeInTheDocument()
    );

    // Button remains interactive (not disabled) during API call
    expect(screen.getByRole("button")).not.toBeDisabled();

    resolvePost(
      new Response(JSON.stringify({ data: { count: 4, liked: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("reverts to previous state when API call fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      const urlStr = String(url);
      const method = (init as RequestInit | undefined)?.method ?? "GET";
      if (urlStr.includes("/api/csrf")) {
        return new Response(JSON.stringify({ data: { token: "t" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (urlStr.includes("/api/likes/") && method === "POST") {
        return new Response(null, { status: 500 });
      }
      return new Response(
        JSON.stringify({ data: { count: 3, liked: false } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    });

    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Like this post" })).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button"));

    // API failed → revert to original state
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Like this post" })
      ).toBeInTheDocument()
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("syncs count from server response after toggle", async () => {
    mockFetch({ initialCount: 9, initialLiked: false, toggleCount: 10, toggleLiked: true });
    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);

    await waitFor(() => expect(screen.getByText("9")).toBeInTheDocument());

    await user.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByText("10")).toBeInTheDocument());
    expect(
      screen.getByRole("button", { name: "Unlike this post" })
    ).toBeInTheDocument();
  });
});
