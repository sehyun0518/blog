import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/button.js";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary-600");
  });

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "border-border");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-muted");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-muted");
  });

  it("applies link variant classes", () => {
    render(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-primary-600", "underline-offset-4");
  });

  it("applies sm size classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9", "px-3");
  });

  it("applies lg size classes", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-11", "px-8");
  });

  it("applies icon size classes", () => {
    render(<Button size="icon">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10", "w-10");
  });

  it("merges custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /home/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
  });

  it("forwards additional HTML button attributes", () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    expect(screen.getByTestId("submit-btn")).toHaveAttribute("type", "submit");
  });

  it("has correct displayName", () => {
    expect(Button.displayName).toBe("Button");
  });
});
