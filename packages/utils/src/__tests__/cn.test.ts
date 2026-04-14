import { describe, expect, it } from "vitest";
import { cn } from "../cn.js";

describe("cn()", () => {
  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges basic class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves Tailwind conflicts — last class wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional classes via object syntax", () => {
    expect(cn({ "bg-red-500": true, "bg-blue-500": false })).toBe("bg-red-500");
  });

  it("handles falsy values without throwing", () => {
    expect(cn("px-2", undefined, null, false, "py-1")).toBe("px-2 py-1");
  });

  it("handles array inputs", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });
});
