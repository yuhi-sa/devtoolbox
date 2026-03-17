import { describe, it, expect } from "vitest";
import { formatJs, minifyJs, validateJs } from "./logic";

describe("js-formatter", () => {
  it("formats code with braces", () => {
    const input = 'function hello() { return 1; }';
    const result = formatJs(input);
    expect(result).toContain("return 1;");
  });

  it("formats nested braces with proper indentation", () => {
    const input = "if (true) { if (false) { x = 1; } }";
    const result = formatJs(input, 2);
    expect(result).toContain("    x = 1;");
  });

  it("handles empty input", () => {
    expect(formatJs("")).toBe("");
    expect(formatJs("   ")).toBe("");
  });

  it("preserves strings during formatting", () => {
    const input = 'const x = "hello world { }";';
    const result = formatJs(input);
    expect(result).toContain('"hello world { }"');
  });

  it("minifies code", () => {
    const input = "function hello() {\n  return 1;\n}";
    const result = minifyJs(input);
    expect(result).toBe("function hello(){return 1;}");
  });

  it("minifies empty input", () => {
    expect(minifyJs("")).toBe("");
    expect(minifyJs("   ")).toBe("");
  });

  it("removes comments when minifying", () => {
    const input = "var x = 1; // comment\nvar y = 2;";
    const result = minifyJs(input);
    expect(result).toBe("var x=1;var y=2;");
  });

  it("removes block comments when minifying", () => {
    const input = "var x = 1; /* block comment */ var y = 2;";
    const result = minifyJs(input);
    expect(result).toBe("var x=1;var y=2;");
  });

  it("validates correct brackets", () => {
    expect(validateJs("function() { return [1, 2]; }")).toEqual({ valid: true });
  });

  it("validates mismatched brackets", () => {
    const result = validateJs("function() { return [1, 2); }");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("detects unclosed brackets", () => {
    const result = validateJs("function() {");
    expect(result.valid).toBe(false);
  });

  it("detects unterminated strings", () => {
    const result = validateJs('var x = "hello');
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unterminated string");
  });

  it("formats with custom indent size", () => {
    const input = "if (true) { x = 1; }";
    const result = formatJs(input, 4);
    expect(result).toContain("    x = 1;");
  });
});
