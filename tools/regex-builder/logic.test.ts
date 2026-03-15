import { describe, it, expect } from "vitest";
import { buildRegex, describeRegex, getAvailablePatterns } from "./logic";

describe("regex-builder", () => {
  it("builds a regex from digit parts", () => {
    const result = buildRegex([{ type: "digits" }]);
    expect(result).toBe("/\\d+/");
  });

  it("applies quantifiers", () => {
    const result = buildRegex([{ type: "digit", quantifier: "+" }]);
    expect(result).toBe("/\\d+/");
  });

  it("includes flags", () => {
    const result = buildRegex([{ type: "letters" }], {
      global: true,
      caseInsensitive: true,
    });
    expect(result).toBe("/[a-zA-Z]+/gi");
  });

  it("builds email pattern", () => {
    const result = buildRegex([{ type: "email" }]);
    expect(result).toContain("@");
    expect(result).toContain("[a-zA-Z0-9._%+-]+");
  });

  it("handles custom patterns", () => {
    const result = buildRegex([{ type: "custom", value: "foo|bar" }]);
    expect(result).toBe("/foo|bar/");
  });

  it("describes a simple pattern", () => {
    const desc = describeRegex([{ type: "digit" }]);
    expect(desc).toContain("a digit (0-9)");
  });

  it("describes quantifiers", () => {
    const desc = describeRegex([{ type: "letter", quantifier: "?" }]);
    expect(desc).toContain("optional");
  });

  it("returns available patterns", () => {
    const patterns = getAvailablePatterns();
    expect(patterns.length).toBeGreaterThan(5);
    expect(patterns.some((p) => p.type === "email")).toBe(true);
  });
});
