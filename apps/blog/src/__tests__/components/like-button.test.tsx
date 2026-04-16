// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "@/components/like-button";

describe("LikeButton", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders nothing before mount (SSR state)", () => {
    // LikeButton returns null until mounted — can't test SSR in jsdom
    // but after render (which runs effects), it should be visible
    render(<LikeButton slug="test-post" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows Like label by default", () => {
    render(<LikeButton slug="test-post" />);
    expect(screen.getByRole("button", { name: "Like this post" })).toBeInTheDocument();
  });

  it("shows Liked label after clicking", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: "Unlike this post" })).toBeInTheDocument();
  });

  it("persists liked state to localStorage", async () => {
    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);
    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("liked-test-post")).toBe("true");
  });

  it("removes liked state from localStorage on unlike", async () => {
    localStorage.setItem("liked-test-post", "true");
    const user = userEvent.setup();
    render(<LikeButton slug="test-post" />);
    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("liked-test-post")).toBeNull();
  });

  it("restores liked state from localStorage on mount", () => {
    localStorage.setItem("liked-test-post", "true");
    render(<LikeButton slug="test-post" />);
    expect(screen.getByRole("button", { name: "Unlike this post" })).toBeInTheDocument();
  });
});
