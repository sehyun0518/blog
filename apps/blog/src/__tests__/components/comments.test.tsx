// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseTheme = vi.fn(() => ({ resolvedTheme: "light" }));

vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

vi.mock("@giscus/react", () => ({
  default: (props: Record<string, string>) => (
    <div data-testid="giscus-widget" data-theme={props.theme} />
  ),
}));

vi.mock("@/lib/config", () => ({
  giscusConfig: {
    repo: "owner/repo",
    repoId: "R_test",
    category: "Announcements",
    categoryId: "DIC_test",
  },
  isGiscusEnabled: () => true,
}));

import { Comments } from "@/components/post";

describe("Comments", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ resolvedTheme: "light" });
  });

  it("renders the Comments heading", () => {
    render(<Comments />);
    expect(screen.getByRole("heading", { name: "댓글" })).toBeInTheDocument();
  });

  it("renders the giscus widget", () => {
    render(<Comments />);
    expect(screen.getByTestId("giscus-widget")).toBeInTheDocument();
  });

  it("passes light theme to giscus in light mode", () => {
    render(<Comments />);
    expect(screen.getByTestId("giscus-widget")).toHaveAttribute("data-theme", "light");
  });

  it("passes dark theme in dark mode", () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: "dark" });
    render(<Comments />);
    expect(screen.getByTestId("giscus-widget")).toHaveAttribute("data-theme", "dark");
  });

  it("renders a section landmark", () => {
    render(<Comments />);
    expect(screen.getByRole("region", { name: "댓글" })).toBeInTheDocument();
  });
});
