// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ReadingProgress } from "@/components/layout";

function setScrollable(scrollY: number, totalHeight: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: totalHeight,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", { value: 500, configurable: true });
}

describe("ReadingProgress", () => {
  beforeEach(() => {
    setScrollable(0, 500);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing at scroll position 0", () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstChild).toBeNull();
  });

  it("renders progressbar after scrolling", () => {
    setScrollable(250, 1000);
    render(<ReadingProgress />);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has correct aria attributes", () => {
    setScrollable(500, 1000);
    render(<ReadingProgress />);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-label", "Reading progress");
  });
});
