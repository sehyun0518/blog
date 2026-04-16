import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../components/badge";

describe("Badge", () => {
  it("renders a div with base badge classes", () => {
    render(<Badge data-testid="badge">New</Badge>);
    const el = screen.getByTestId("badge");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("inline-flex", "items-center", "rounded-full");
  });

  it("applies default variant classes", () => {
    render(<Badge data-testid="badge">Default</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("bg-primary-600", "text-white");
  });

  it("applies secondary variant classes", () => {
    render(<Badge variant="secondary" data-testid="badge">Secondary</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("bg-muted", "text-foreground");
  });

  it("applies destructive variant classes", () => {
    render(<Badge variant="destructive" data-testid="badge">Error</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("bg-red-600", "text-white");
  });

  it("applies outline variant classes", () => {
    render(<Badge variant="outline" data-testid="badge">Outline</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("border-border", "text-foreground");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-badge" data-testid="badge">Custom</Badge>);
    expect(screen.getByTestId("badge")).toHaveClass("custom-badge");
  });

  it("renders children", () => {
    render(<Badge>Live</Badge>);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });
});
