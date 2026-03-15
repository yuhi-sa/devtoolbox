import { describe, it, expect } from "vitest";
import { minifyCss, formatCss, getSizeStats } from "./logic";

describe("css-minifier", () => {
  it("minifies CSS by removing whitespace", () => {
    const input = "body {\n  color: red;\n  margin: 0;\n}";
    expect(minifyCss(input)).toBe("body{color:red;margin:0}");
  });

  it("removes CSS comments", () => {
    const input = "/* comment */\nbody { color: red; }";
    expect(minifyCss(input)).toBe("body{color:red}");
  });

  it("removes trailing semicolons before closing brace", () => {
    const input = "p { font-size: 14px; }";
    expect(minifyCss(input)).toBe("p{font-size:14px}");
  });

  it("handles empty input", () => {
    expect(minifyCss("")).toBe("");
    expect(minifyCss("   ")).toBe("");
  });

  it("formats CSS with proper indentation", () => {
    const input = "body{color:red;margin:0}";
    const formatted = formatCss(input);
    expect(formatted).toContain("body {");
    expect(formatted).toContain("  color:red;");
    expect(formatted).toContain("}");
  });

  it("calculates size stats correctly", () => {
    const original = "body {\n  color: red;\n  margin: 0;\n}";
    const minified = minifyCss(original);
    const stats = getSizeStats(original, minified);
    expect(stats.originalSize).toBeGreaterThan(stats.resultSize);
    expect(stats.reduction).toBeGreaterThan(0);
    expect(stats.reductionPercent).toBeGreaterThan(0);
  });

  it("handles multiple selectors", () => {
    const input = "h1, h2, h3 { font-weight: bold; }";
    expect(minifyCss(input)).toBe("h1,h2,h3{font-weight:bold}");
  });
});
