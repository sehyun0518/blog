// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

import { ImageWithCaption } from "@/components/mdx/image-with-caption";

describe("ImageWithCaption", () => {
  it("renders nothing when src is missing", () => {
    const { container } = render(<ImageWithCaption />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an image with the given src and alt", () => {
    render(<ImageWithCaption src="/test.png" alt="Test image" />);
    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.png");
  });

  it("renders a figcaption when alt is provided", () => {
    render(<ImageWithCaption src="/test.png" alt="My caption" />);
    expect(screen.getByText("My caption")).toBeInTheDocument();
  });

  it("does not render figcaption when alt is empty", () => {
    render(<ImageWithCaption src="/test.png" alt="" />);
    expect(screen.queryByRole("figure")?.querySelector("figcaption")).toBeNull();
  });

  it("renders inside a figure element", () => {
    render(<ImageWithCaption src="/test.png" alt="caption" />);
    expect(screen.getByRole("img").closest("figure")).toBeInTheDocument();
  });
});
