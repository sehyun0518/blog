// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("reverts label back after timeout", async () => {
    const user = userEvent.setup({ delay: null });
    render(<TestWrapper />);
    await user.click(screen.getByRole("button", { name: "코드 복사" }));
    expect(screen.getByRole("button", { name: "복사됨" })).toBeInTheDocument();
  });
});
