// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "@/components/mdx/callout";

describe("Callout", () => {
  it("renders children", () => {
    render(<Callout type="info">Some info text</Callout>);
    expect(screen.getByText("Some info text")).toBeInTheDocument();
  });

  it("shows default label when no title is provided", () => {
    render(<Callout type="warning">Watch out</Callout>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("shows custom title when provided", () => {
    render(<Callout type="tip" title="Pro Tip">Do this</Callout>);
    expect(screen.getByText("Pro Tip")).toBeInTheDocument();
  });

  it("defaults to info type", () => {
    render(<Callout>Default callout</Callout>);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("renders as a note landmark", () => {
    render(<Callout type="danger">Danger!</Callout>);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it.each(["info", "tip", "warning", "danger"] as const)(
    "renders %s type without throwing",
    (type) => {
      expect(() => render(<Callout type={type}>content</Callout>)).not.toThrow();
    }
  );
});
