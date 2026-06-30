// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/lib/config", () => ({
  githubUrl: "https://github.com/test",
}));

import { Footer } from "@/components/layout";

describe("Footer", () => {
  it("renders copyright text with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders RSS feed link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "RSS" })).toHaveAttribute("href", "/feed.xml");
  });

  it("renders GitHub link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/test");
  });

  it("renders footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
