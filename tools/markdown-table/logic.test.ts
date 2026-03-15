import { describe, it, expect } from "vitest";
import { generateMarkdownTable } from "./logic";

describe("markdown-table", () => {
  it("generates a basic table", () => {
    const result = generateMarkdownTable(
      ["Name", "Age"],
      [["Alice", "30"], ["Bob", "25"]]
    );
    expect(result).toContain("| Name | Age |");
    expect(result).toContain("| Alice | 30 |");
    expect(result).toContain("| Bob | 25 |");
  });

  it("includes separator row", () => {
    const result = generateMarkdownTable(["A"], [["1"]]);
    expect(result).toContain("| --- |");
  });

  it("supports left alignment", () => {
    const result = generateMarkdownTable(["Col"], [["val"]], ["left"]);
    expect(result).toContain("| --- |");
  });

  it("supports center alignment", () => {
    const result = generateMarkdownTable(["Col"], [["val"]], ["center"]);
    expect(result).toContain("| :---: |");
  });

  it("supports right alignment", () => {
    const result = generateMarkdownTable(["Col"], [["val"]], ["right"]);
    expect(result).toContain("| ---: |");
  });

  it("returns empty string for empty headers", () => {
    const result = generateMarkdownTable([], []);
    expect(result).toBe("");
  });

  it("escapes pipe characters in cell values", () => {
    const result = generateMarkdownTable(["Val"], [["a|b"]]);
    expect(result).toContain("a\\|b");
  });
});
