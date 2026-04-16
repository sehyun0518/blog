// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

describe("ThemeToggle", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    setTheme.mockClear();
  });

  it("renders a button with aria-label", () => {
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
      theme: "light",
      themes: [],
      systemTheme: undefined,
      forcedTheme: undefined,
    });
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeInTheDocument();
  });

  it("calls setTheme with dark when resolved theme is light", async () => {
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
      theme: "light",
      themes: [],
      systemTheme: undefined,
      forcedTheme: undefined,
    });
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with light when resolved theme is dark", async () => {
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "dark",
      setTheme,
      theme: "dark",
      themes: [],
      systemTheme: undefined,
      forcedTheme: undefined,
    });
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
