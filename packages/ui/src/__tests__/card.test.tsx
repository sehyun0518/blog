import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";

describe("Card", () => {
  it("renders a div with card base classes", () => {
    render(<Card data-testid="card" />);
    const el = screen.getByTestId("card");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("rounded-xl", "border-border", "bg-card");
  });

  it("merges custom className", () => {
    render(<Card className="my-class" data-testid="card" />);
    expect(screen.getByTestId("card")).toHaveClass("my-class");
  });

  it("has correct displayName", () => {
    expect(Card.displayName).toBe("Card");
  });
});

describe("CardHeader", () => {
  it("renders with header classes", () => {
    render(<CardHeader data-testid="header" />);
    expect(screen.getByTestId("header")).toHaveClass("flex", "flex-col", "p-6");
  });

  it("has correct displayName", () => {
    expect(CardHeader.displayName).toBe("CardHeader");
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title Text</CardTitle>);
    const el = screen.getByRole("heading", { level: 3 });
    expect(el).toHaveTextContent("Title Text");
    expect(el).toHaveClass("text-2xl", "font-semibold");
  });

  it("has correct displayName", () => {
    expect(CardTitle.displayName).toBe("CardTitle");
  });
});

describe("CardDescription", () => {
  it("renders as p with muted style", () => {
    render(<CardDescription data-testid="desc">Desc</CardDescription>);
    const el = screen.getByTestId("desc");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("text-muted-foreground");
  });
});

describe("CardContent", () => {
  it("renders with content padding", () => {
    render(<CardContent data-testid="content" />);
    expect(screen.getByTestId("content")).toHaveClass("p-6", "pt-0");
  });
});

describe("CardFooter", () => {
  it("renders with footer flex layout", () => {
    render(<CardFooter data-testid="footer" />);
    expect(screen.getByTestId("footer")).toHaveClass("flex", "items-center", "p-6", "pt-0");
  });
});
