// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@blog/ui/button", () => ({
  Button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  buttonVariants: () => "",
}));

import { BackToTop } from "@/components/back-to-top";

describe("BackToTop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });

  it("renders nothing when scroll is below threshold", () => {
    const { container } = render(<BackToTop />);
    expect(container.firstChild).toBeNull();
  });

  it("renders button after scrolling past threshold", () => {
    render(<BackToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "맨 위로" })).toBeInTheDocument();
  });

  it("calls scrollTo on click", async () => {
    const user = userEvent.setup();
    render(<BackToTop />);
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    await user.click(screen.getByRole("button", { name: "맨 위로" }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
