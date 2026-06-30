// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

vi.mock("@/lib/config", () => ({
  siteName: "Blog",
  siteUrl: "http://localhost:3000",
  githubUrl: "https://github.com/test",
}));

import { Header } from "@/components/layout";

describe("Header", () => {
  it("renders the site name as a link to /", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: "Blog" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the theme toggle button", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeInTheDocument();
  });

  it("renders the GitHub link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/test");
  });

  it("renders a header landmark", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
