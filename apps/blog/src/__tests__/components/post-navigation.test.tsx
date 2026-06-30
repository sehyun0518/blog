// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { PostNavigation } from "@/components/post";
import type { PostMeta } from "@/types/post";

const mockPost = (slug: string, title: string): PostMeta => ({
  slug,
  title,
  date: "2026-04-10",
  description: "desc",
  tags: [],
  readingTime: "1 min read",
  draft: false,
});

describe("PostNavigation", () => {
  it("renders nothing when both prev and next are null", () => {
    const { container } = render(<PostNavigation prev={null} next={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders previous post link", () => {
    render(<PostNavigation prev={mockPost("old-post", "Old Post")} next={null} />);
    expect(screen.getByText("Old Post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /old post/i })).toHaveAttribute("href", "/posts/old-post");
  });

  it("renders next post link", () => {
    render(<PostNavigation prev={null} next={mockPost("new-post", "New Post")} />);
    expect(screen.getByText("New Post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /new post/i })).toHaveAttribute("href", "/posts/new-post");
  });

  it("renders both prev and next", () => {
    render(
      <PostNavigation
        prev={mockPost("old-post", "Old Post")}
        next={mockPost("new-post", "New Post")}
      />
    );
    expect(screen.getByText("Old Post")).toBeInTheDocument();
    expect(screen.getByText("New Post")).toBeInTheDocument();
  });

  it("renders post navigation landmark", () => {
    render(<PostNavigation prev={mockPost("slug", "Title")} next={null} />);
    expect(screen.getByRole("navigation", { name: "Post navigation" })).toBeInTheDocument();
  });
});
