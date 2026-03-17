import { describe, it, expect } from "vitest";
import {
  generateBorderRadiusCSS,
  generateIndividualCSS,
  getBorderRadiusValue,
  defaultBorderRadius,
} from "./logic";

describe("border-radius", () => {
  it("generates shorthand when all values are equal", () => {
    const css = generateBorderRadiusCSS(defaultBorderRadius);
    expect(css).toBe("border-radius: 8px;");
  });

  it("generates two-value shorthand", () => {
    const css = generateBorderRadiusCSS({
      ...defaultBorderRadius,
      topLeft: 10,
      topRight: 20,
      bottomRight: 10,
      bottomLeft: 20,
    });
    expect(css).toBe("border-radius: 10px 20px;");
  });

  it("generates three-value shorthand", () => {
    const css = generateBorderRadiusCSS({
      ...defaultBorderRadius,
      topLeft: 10,
      topRight: 20,
      bottomRight: 30,
      bottomLeft: 20,
    });
    expect(css).toBe("border-radius: 10px 20px 30px;");
  });

  it("generates four-value shorthand", () => {
    const css = generateBorderRadiusCSS({
      ...defaultBorderRadius,
      topLeft: 10,
      topRight: 20,
      bottomRight: 30,
      bottomLeft: 40,
    });
    expect(css).toBe("border-radius: 10px 20px 30px 40px;");
  });

  it("supports percentage unit", () => {
    const css = generateBorderRadiusCSS({
      ...defaultBorderRadius,
      topLeft: 50,
      topRight: 50,
      bottomRight: 50,
      bottomLeft: 50,
      unit: "%",
    });
    expect(css).toBe("border-radius: 50%;");
  });

  it("supports rem unit", () => {
    const css = generateBorderRadiusCSS({
      ...defaultBorderRadius,
      unit: "rem",
    });
    expect(css).toBe("border-radius: 8rem;");
  });

  it("generates individual CSS properties", () => {
    const css = generateIndividualCSS(defaultBorderRadius);
    expect(css).toContain("border-top-left-radius: 8px;");
    expect(css).toContain("border-top-right-radius: 8px;");
    expect(css).toContain("border-bottom-right-radius: 8px;");
    expect(css).toContain("border-bottom-left-radius: 8px;");
  });

  it("gets border-radius value string", () => {
    const value = getBorderRadiusValue(defaultBorderRadius);
    expect(value).toBe("8px 8px 8px 8px");
  });

  it("generates individual CSS with mixed values", () => {
    const css = generateIndividualCSS({
      ...defaultBorderRadius,
      topLeft: 10,
      topRight: 0,
      bottomRight: 20,
      bottomLeft: 5,
    });
    expect(css).toContain("border-top-left-radius: 10px;");
    expect(css).toContain("border-top-right-radius: 0px;");
  });
});
