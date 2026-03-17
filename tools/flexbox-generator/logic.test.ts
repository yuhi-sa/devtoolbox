import { describe, it, expect } from "vitest";
import {
  generateFlexboxCSS,
  generateFullFlexboxCSS,
  defaultFlexboxOptions,
} from "./logic";

describe("flexbox-generator", () => {
  it("generates default flex CSS with only display and gap", () => {
    const css = generateFlexboxCSS(defaultFlexboxOptions);
    expect(css).toContain("display: flex;");
    expect(css).toContain("gap: 8px;");
    expect(css).not.toContain("flex-direction:");
    expect(css).not.toContain("justify-content:");
    expect(css).not.toContain("align-items:");
  });

  it("includes flex-direction when not row", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, direction: "column" });
    expect(css).toContain("flex-direction: column;");
  });

  it("includes justify-content when not flex-start", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, justifyContent: "center" });
    expect(css).toContain("justify-content: center;");
  });

  it("includes align-items when not stretch", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, alignItems: "center" });
    expect(css).toContain("align-items: center;");
  });

  it("includes flex-wrap when not nowrap", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, flexWrap: "wrap" });
    expect(css).toContain("flex-wrap: wrap;");
  });

  it("omits gap when zero", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, gap: 0 });
    expect(css).not.toContain("gap:");
  });

  it("generates full CSS with all properties", () => {
    const css = generateFullFlexboxCSS(defaultFlexboxOptions);
    expect(css).toContain("display: flex;");
    expect(css).toContain("flex-direction: row;");
    expect(css).toContain("justify-content: flex-start;");
    expect(css).toContain("align-items: stretch;");
    expect(css).toContain("flex-wrap: nowrap;");
    expect(css).toContain("gap: 8px;");
  });

  it("handles all direction options", () => {
    const directions = ["row", "row-reverse", "column", "column-reverse"] as const;
    for (const dir of directions) {
      const css = generateFullFlexboxCSS({ ...defaultFlexboxOptions, direction: dir });
      expect(css).toContain(`flex-direction: ${dir};`);
    }
  });

  it("handles space-between justify", () => {
    const css = generateFlexboxCSS({ ...defaultFlexboxOptions, justifyContent: "space-between" });
    expect(css).toContain("justify-content: space-between;");
  });
});
