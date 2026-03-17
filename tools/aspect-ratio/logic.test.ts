import { describe, it, expect } from "vitest";
import { calculateAspectRatio, resizeByWidth, resizeByHeight } from "./logic";

describe("aspect-ratio", () => {
  it("calculates 16:9 ratio", () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.ratio).toBe("16:9");
    expect(result.width).toBe(16);
    expect(result.height).toBe(9);
  });

  it("calculates 4:3 ratio", () => {
    const result = calculateAspectRatio(1024, 768);
    expect(result.ratio).toBe("4:3");
  });

  it("calculates 1:1 ratio", () => {
    const result = calculateAspectRatio(500, 500);
    expect(result.ratio).toBe("1:1");
    expect(result.decimal).toBeCloseTo(1.0);
  });

  it("calculates decimal value", () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.decimal).toBeCloseTo(1.778, 2);
  });

  it("throws on zero width", () => {
    expect(() => calculateAspectRatio(0, 100)).toThrow();
  });

  it("throws on negative height", () => {
    expect(() => calculateAspectRatio(100, -1)).toThrow();
  });

  it("resizes by width maintaining ratio", () => {
    const result = resizeByWidth(16, 9, 1920);
    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });

  it("resizes by height maintaining ratio", () => {
    const result = resizeByHeight(16, 9, 1080);
    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });
});
