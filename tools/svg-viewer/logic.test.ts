import { describe, it, expect } from "vitest";
import { optimizeSvg, getSvgStats } from "./logic";

describe("svg-viewer", () => {
  it("removes XML comments", () => {
    const input = '<svg><!-- comment --><rect /></svg>';
    expect(optimizeSvg(input)).toBe("<svg><rect /></svg>");
  });

  it("removes whitespace between tags", () => {
    const input = "<svg>  <rect />  </svg>";
    expect(optimizeSvg(input)).toBe("<svg><rect /></svg>");
  });

  it("removes empty groups", () => {
    const input = "<svg><g>  </g><rect /></svg>";
    expect(optimizeSvg(input)).toBe("<svg><rect /></svg>");
  });

  it("returns correct size in bytes", () => {
    const input = '<svg><rect width="10" /></svg>';
    const stats = getSvgStats(input);
    expect(stats.size).toBe(new TextEncoder().encode(input).length);
  });

  it("counts elements correctly", () => {
    const input = '<svg><rect /><circle /><path /></svg>';
    const stats = getSvgStats(input);
    expect(stats.elements).toBe(4); // svg, rect, circle, path
  });

  it("extracts viewBox", () => {
    const input = '<svg viewBox="0 0 100 100"><rect /></svg>';
    const stats = getSvgStats(input);
    expect(stats.viewBox).toBe("0 0 100 100");
  });

  it("returns null viewBox when missing", () => {
    const input = "<svg><rect /></svg>";
    const stats = getSvgStats(input);
    expect(stats.viewBox).toBeNull();
  });
});
