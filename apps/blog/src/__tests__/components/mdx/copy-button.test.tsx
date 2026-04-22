// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { CopyButton } from "@/components/mdx/copy-button";

function TestWrapper({ text = "const x = 1;" }: { text?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  return (
    <>
      <pre ref={ref}>{text}</pre>
      <CopyButton preRef={ref} />
    </>
  );
}

describe("CopyButton", () => {
  it("renders with Copy code aria-label", () => {
    render(<TestWrapper />);
    expect(screen.getByRole("button", { name: "코드 복사" })).toBeInTheDocument();
  });

  it("changes label to Copied after click", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    await user.click(screen.getByRole("button", { name: "코드 복사" }));
    expect(screen.getByRole("button", { name: "복사됨" })).toBeInTheDocument();
  });

  it("reverts label back to original after timeout", async () => {
    // Intercept only the component's 2000ms revert timeout.
    // Shorter timeouts (userEvent internals) keep using real setTimeout.
    const origSetTimeout = globalThis.setTimeout;
    let revertCallback: (() => void) | undefined;

    vi.spyOn(globalThis, "setTimeout").mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fn: any, delay?: number, ...args: any[]) => {
        if (typeof delay === "number" && delay >= 2000) {
          revertCallback = () => fn(...args);
          return 999 as unknown as ReturnType<typeof setTimeout>;
        }
        return origSetTimeout(fn, delay, ...args);
      }
    );

    const user = userEvent.setup();
    render(<TestWrapper />);

    await user.click(screen.getByRole("button", { name: "코드 복사" }));
    expect(screen.getByRole("button", { name: "복사됨" })).toBeInTheDocument();

    act(() => { revertCallback?.(); });
    expect(screen.getByRole("button", { name: "코드 복사" })).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
