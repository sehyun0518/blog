// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import { Pagination } from "@/components/pagination";

const buildHref = (page: number) => `/?page=${page}`;

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(<Pagination page={1} totalPages={1} buildHref={buildHref} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(<Pagination page={1} totalPages={0} buildHref={buildHref} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders page count", () => {
    render(<Pagination page={2} totalPages={5} buildHref={buildHref} />);
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("renders next link when not on last page", () => {
    render(<Pagination page={1} totalPages={3} buildHref={buildHref} />);
    expect(screen.getByRole("link", { name: "다음 페이지" })).toHaveAttribute("href", "/?page=2");
  });

  it("renders prev link when not on first page", () => {
    render(<Pagination page={3} totalPages={5} buildHref={buildHref} />);
    expect(screen.getByRole("link", { name: "이전 페이지" })).toHaveAttribute("href", "/?page=2");
  });

  it("disables prev on first page", () => {
    render(<Pagination page={1} totalPages={3} buildHref={buildHref} />);
    expect(screen.queryByRole("link", { name: "이전 페이지" })).toBeNull();
  });

  it("disables next on last page", () => {
    render(<Pagination page={3} totalPages={3} buildHref={buildHref} />);
    expect(screen.queryByRole("link", { name: "다음 페이지" })).toBeNull();
  });
});
