import { describe, it, expect } from "vitest";
import { generateGradientCSS, generateFullCSS, directionPresets } from "./logic";

describe("gradient", () => {
  it("generates linear gradient CSS", () => {
    const css = generateGradientCSS({ type: "linear", angle: 90, color1: "#ff0000", color2: "#0000ff" });
    expect(css).toBe("linear-gradient(90deg, #ff0000, #0000ff)");
  });

  it("generates radial gradient CSS", () => {
    const css = generateGradientCSS({ type: "radial", angle: 0, color1: "#ff0000", color2: "#0000ff" });
    expect(css).toBe("radial-gradient(circle, #ff0000, #0000ff)");
  });

  it("supports three colors", () => {
    const css = generateGradientCSS({ type: "linear", angle: 45, color1: "#ff0000", color2: "#00ff00", color3: "#0000ff" });
    expect(css).toBe("linear-gradient(45deg, #ff0000, #00ff00, #0000ff)");
  });

  it("generates full CSS with background property", () => {
    const css = generateFullCSS({ type: "linear", angle: 90, color1: "#ff0000", color2: "#0000ff" });
    expect(css).toContain("background:");
    expect(css).toContain("linear-gradient");
  });

  it("has direction presets with valid angles", () => {
    expect(directionPresets.length).toBeGreaterThanOrEqual(4);
    directionPresets.forEach((p) => {
      expect(p.angle).toBeGreaterThanOrEqual(0);
      expect(p.angle).toBeLessThanOrEqual(360);
    });
  });
});
