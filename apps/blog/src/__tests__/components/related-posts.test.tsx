// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@blog/utils/date", () => ({
  formatDate: (d: string) => d,
}));

import { RelatedPosts } from "@/components/related-posts";
import type { PostMeta } from "@/types/post";

function makePost(slug: string, title: string): PostMeta {
  return {
    slug, title,
    date: "2026-04-01",
    description: "desc",
    tags: ["react"],
    draft: false,
    readingTime: "1 min read",
  };
}

describe("RelatedPosts", () => {
  it("renders nothing for empty posts array", () => {
    const { container } = render(<RelatedPosts posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Related Posts heading", () => {
    render(<RelatedPosts posts={[makePost("post-a", "Post A")]} />);
    expect(screen.getByRole("heading", { name: "관련 포스트" })).toBeInTheDocument();
  });

  it("renders post titles as links", () => {
    render(<RelatedPosts posts={[makePost("post-a", "Post A"), makePost("post-b", "Post B")]} />);
    expect(screen.getByRole("link", { name: /post a/i })).toHaveAttribute("href", "/posts/post-a");
    expect(screen.getByRole("link", { name: /post b/i })).toHaveAttribute("href", "/posts/post-b");
  });

  it("renders reading time for each post", () => {
    render(<RelatedPosts posts={[makePost("post-a", "Post A")]} />);
    expect(screen.getByText(/1 min read/)).toBeInTheDocument();
  });
});
