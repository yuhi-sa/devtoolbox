import { describe, it, expect } from "vitest";
import { convertCssUnit, convertToAllUnits } from "./logic";

describe("css-unit-converter", () => {
  it("converts px to rem", () => {
    expect(convertCssUnit(16, "px", "rem")).toBe(1);
  });

  it("converts rem to px", () => {
    expect(convertCssUnit(1, "rem", "px")).toBe(16);
  });

  it("converts px to rem with custom base", () => {
    expect(convertCssUnit(20, "px", "rem", { baseFontSize: 20 })).toBe(1);
  });

  it("converts px to vw", () => {
    expect(convertCssUnit(192, "px", "vw", { viewportWidth: 1920 })).toBe(10);
  });

  it("converts px to vh", () => {
    expect(convertCssUnit(108, "px", "vh", { viewportHeight: 1080 })).toBe(10);
  });

  it("converts em to px with parent font size", () => {
    expect(convertCssUnit(2, "em", "px", { parentFontSize: 20 })).toBe(40);
  });

  it("same unit returns same value", () => {
    expect(convertCssUnit(100, "px", "px")).toBe(100);
  });

  it("converts to all units", () => {
    const result = convertToAllUnits(16, "px");
    expect(result.px).toBe(16);
    expect(result.rem).toBe(1);
    expect(result.em).toBe(1);
  });
});
