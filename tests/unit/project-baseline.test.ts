import { describe, expect, it } from "vitest";

describe("project baseline", () => {
  it("runs tests through the configured @ alias", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
