import { describe, it, expect } from "vitest";
import {
  generateBoxShadowCSS,
  generateFullCSS,
  generateMultipleShadowsCSS,
  hexToRgba,
  defaultBoxShadow,
} from "./logic";

describe("box-shadow", () => {
  it("generates basic box-shadow CSS", () => {
    const css = generateBoxShadowCSS(defaultBoxShadow);
    expect(css).toContain("4px 4px 10px 0px");
    expect(css).toContain("rgba(0, 0, 0, 0.25)");
  });

  it("generates inset box-shadow", () => {
    const css = generateBoxShadowCSS({ ...defaultBoxShadow, inset: true });
    expect(css.startsWith("inset ")).toBe(true);
  });

  it("generates full CSS property", () => {
    const css = generateFullCSS(defaultBoxShadow);
    expect(css.startsWith("box-shadow:")).toBe(true);
    expect(css.endsWith(";")).toBe(true);
  });

  it("converts hex to rgba", () => {
    expect(hexToRgba("#ff0000", 50)).toBe("rgba(255, 0, 0, 0.5)");
    expect(hexToRgba("#000000", 100)).toBe("rgba(0, 0, 0, 1)");
    expect(hexToRgba("#ffffff", 0)).toBe("rgba(255, 255, 255, 0)");
  });

  it("handles custom values", () => {
    const css = generateBoxShadowCSS({
      x: 10,
      y: -5,
      blur: 20,
      spread: 3,
      color: "#3366ff",
      opacity: 75,
      inset: false,
    });
    expect(css).toContain("10px -5px 20px 3px");
    expect(css).toContain("rgba(51, 102, 255, 0.75)");
  });

  it("generates multiple shadows", () => {
    const css = generateMultipleShadowsCSS([defaultBoxShadow, { ...defaultBoxShadow, x: 0, y: 0 }]);
    expect(css).toContain("box-shadow:");
    expect(css).toContain(",");
  });

  it("returns empty for no shadows", () => {
    expect(generateMultipleShadowsCSS([])).toBe("");
  });

  it("handles zero opacity", () => {
    const css = generateBoxShadowCSS({ ...defaultBoxShadow, opacity: 0 });
    expect(css).toContain("rgba(0, 0, 0, 0)");
  });
});
