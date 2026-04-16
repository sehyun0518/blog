import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TagBadge } from "../components/tag-badge";

describe("TagBadge", () => {
  it("renders the tag text", () => {
    render(<TagBadge tag="nextjs" />);
    expect(screen.getByText("nextjs")).toBeInTheDocument();
  });

  it("renders as a button", () => {
    render(<TagBadge tag="react" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("uses secondary badge variant when inactive", () => {
    render(<TagBadge tag="test" active={false} />);
    const badge = screen.getByText("test");
    expect(badge).toHaveClass("bg-muted");
  });

  it("uses default badge variant when active", () => {
    render(<TagBadge tag="test" active />);
    const badge = screen.getByText("test");
    expect(badge).toHaveClass("bg-primary-600");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<TagBadge tag="typescript" onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("applies custom className to the button", () => {
    render(<TagBadge tag="test" className="custom-class" data-testid="btn" />);
    expect(screen.getByTestId("btn")).toHaveClass("custom-class");
  });
});
