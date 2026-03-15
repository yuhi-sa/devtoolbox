import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  generatePalette,
} from "./logic";

describe("color-palette", () => {
  it("converts hex to rgb", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("converts rgb to hex", () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe("#00ff00");
  });

  it("round-trips hex through hsl and back", () => {
    const hex = "#3b82f6";
    const hsl = hexToHsl(hex);
    const result = hslToHex(hsl);
    expect(result).toBe(hex);
  });

  it("converts black correctly", () => {
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    const hsl = hexToHsl("#000000");
    expect(hsl.l).toBe(0);
  });

  it("converts white correctly", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    const hsl = hexToHsl("#ffffff");
    expect(hsl.l).toBe(1);
  });

  it("generates a palette with 10 colors", () => {
    const palette = generatePalette("#3b82f6");
    expect(palette).toHaveLength(10);
  });

  it("palette includes the base color", () => {
    const palette = generatePalette("#ff0000");
    expect(palette[0].label).toBe("Base");
    expect(palette[0].hex).toBe("#ff0000");
  });
});
