// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockUsePathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

import { NavLink } from "@/components/layout";

describe("NavLink", () => {
  it("renders link with correct href", () => {
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("sets aria-current=page when active", () => {
    mockUsePathname.mockReturnValue("/about");
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current when inactive", () => {
    mockUsePathname.mockReturnValue("/");
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
