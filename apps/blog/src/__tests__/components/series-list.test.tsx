// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { SeriesList } from "@/components/post";
import type { PostMeta } from "@/types/post";

function makePost(slug: string, title: string, part: number): PostMeta {
  return {
    slug, title,
    date: "2026-04-01",
    description: "desc",
    tags: [],
    draft: false,
    readingTime: "1 min read",
    series: "Test Series",
    seriesPart: part,
  };
}

const posts = [makePost("part-1", "Part One", 1), makePost("part-2", "Part Two", 2)];

describe("SeriesList", () => {
  it("renders nothing for a single post", () => {
    const { container } = render(<SeriesList posts={[posts[0]!]} currentSlug="part-1" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders series name", () => {
    render(<SeriesList posts={posts} currentSlug="part-1" />);
    expect(screen.getByText("시리즈: Test Series")).toBeInTheDocument();
  });

  it("renders all post titles", () => {
    render(<SeriesList posts={posts} currentSlug="part-1" />);
    expect(screen.getByText("Part One")).toBeInTheDocument();
    expect(screen.getByText("Part Two")).toBeInTheDocument();
  });

  it("renders current post as plain text, not a link", () => {
    render(<SeriesList posts={posts} currentSlug="part-1" />);
    expect(screen.queryByRole("link", { name: "Part One" })).toBeNull();
    expect(screen.getByRole("link", { name: "Part Two" })).toBeInTheDocument();
  });

  it("links to other posts in series", () => {
    render(<SeriesList posts={posts} currentSlug="part-1" />);
    expect(screen.getByRole("link", { name: "Part Two" })).toHaveAttribute("href", "/posts/part-2");
  });
});
