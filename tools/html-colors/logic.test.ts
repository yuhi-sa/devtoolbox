import { describe, it, expect } from "vitest";
import { searchColors, formatRgb, HTML_COLORS } from "./logic";

describe("html-colors", () => {
  it("returns all colors when query is empty", () => {
    expect(searchColors("")).toEqual(HTML_COLORS);
    expect(searchColors("  ")).toEqual(HTML_COLORS);
  });

  it("has at least 140 colors", () => {
    expect(HTML_COLORS.length).toBeGreaterThanOrEqual(140);
  });

  it("searches by name", () => {
    const results = searchColors("red");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.name === "Red")).toBe(true);
  });

  it("searches by hex", () => {
    const results = searchColors("#FF0000");
    expect(results.some((c) => c.name === "Red")).toBe(true);
  });

  it("searches case-insensitively", () => {
    const results = searchColors("BLUE");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for no match", () => {
    expect(searchColors("zzzznotacolor")).toEqual([]);
  });

  it("formats RGB correctly", () => {
    expect(formatRgb([255, 0, 0])).toBe("rgb(255, 0, 0)");
    expect(formatRgb([0, 0, 0])).toBe("rgb(0, 0, 0)");
  });
});
