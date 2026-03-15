import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  parseColorInput,
} from "./logic";

describe("color-converter", () => {
  it("converts HEX to RGB", () => {
    expect(hexToRgb("#ff6600")).toEqual({ r: 255, g: 102, b: 0 });
  });

  it("converts RGB to HEX", () => {
    expect(rgbToHex({ r: 255, g: 102, b: 0 })).toBe("#ff6600");
  });

  it("converts RGB to HSL", () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 });
  });

  it("converts HSL to RGB", () => {
    const rgb = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("parses HEX input correctly", () => {
    const result = parseColorInput("#000000");
    expect(result.hex).toBe("#000000");
    expect(result.rgb).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("parses RGB input correctly", () => {
    const result = parseColorInput("rgb(255, 255, 255)");
    expect(result.hex).toBe("#ffffff");
    expect(result.hsl).toEqual({ h: 0, s: 0, l: 100 });
  });

  it("throws on invalid input", () => {
    expect(() => parseColorInput("not-a-color")).toThrow();
  });
});
