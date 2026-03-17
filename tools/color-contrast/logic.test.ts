import { describe, it, expect } from "vitest";
import { calculateContrastRatio, isValidHexColor } from "./logic";

describe("color-contrast", () => {
  it("calculates black on white as 21:1", () => {
    const result = calculateContrastRatio("#000000", "#ffffff");
    expect(result.ratio).toBe(21);
    expect(result.aa.normalText).toBe(true);
    expect(result.aaa.normalText).toBe(true);
  });

  it("calculates white on white as 1:1", () => {
    const result = calculateContrastRatio("#ffffff", "#ffffff");
    expect(result.ratio).toBe(1);
    expect(result.aa.normalText).toBe(false);
    expect(result.aa.largeText).toBe(false);
  });

  it("handles shorthand hex", () => {
    const result = calculateContrastRatio("#000", "#fff");
    expect(result.ratio).toBe(21);
  });

  it("evaluates AA normal text (4.5:1)", () => {
    // Gray on white gives ~4.5:1
    const result = calculateContrastRatio("#767676", "#ffffff");
    expect(result.aa.normalText).toBe(true);
  });

  it("evaluates AAA large text (4.5:1)", () => {
    const result = calculateContrastRatio("#767676", "#ffffff");
    expect(result.aaa.largeText).toBe(true);
  });

  it("throws on invalid hex", () => {
    expect(() => calculateContrastRatio("#xyz", "#ffffff")).toThrow();
  });

  it("validates hex colors", () => {
    expect(isValidHexColor("#ff0000")).toBe(true);
    expect(isValidHexColor("#f00")).toBe(true);
    expect(isValidHexColor("ff0000")).toBe(true);
    expect(isValidHexColor("#xyz")).toBe(false);
    expect(isValidHexColor("#12345")).toBe(false);
  });
});
