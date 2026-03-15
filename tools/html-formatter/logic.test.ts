import { describe, it, expect } from "vitest";
import { formatHtml, minifyHtml, isSelfClosingTag, getHtmlSizeStats } from "./logic";

describe("html-formatter", () => {
  it("formats nested HTML with indentation", () => {
    const input = "<div>\n<p>Hello</p>\n</div>";
    const formatted = formatHtml(input);
    expect(formatted).toContain("  <p>");
    expect(formatted).toContain("</div>");
  });

  it("minifies HTML by removing whitespace between tags", () => {
    const input = "<div>\n  <p>Hello</p>\n</div>";
    expect(minifyHtml(input)).toBe("<div><p>Hello</p></div>");
  });

  it("removes HTML comments when minifying", () => {
    const input = "<div><!-- comment --><p>Text</p></div>";
    expect(minifyHtml(input)).toBe("<div><p>Text</p></div>");
  });

  it("identifies self-closing tags", () => {
    expect(isSelfClosingTag("br")).toBe(true);
    expect(isSelfClosingTag("img")).toBe(true);
    expect(isSelfClosingTag("input")).toBe(true);
    expect(isSelfClosingTag("div")).toBe(false);
    expect(isSelfClosingTag("span")).toBe(false);
  });

  it("handles empty input", () => {
    expect(formatHtml("")).toBe("");
    expect(minifyHtml("")).toBe("");
    expect(formatHtml("   ")).toBe("");
  });

  it("calculates size stats correctly", () => {
    const original = "<div>\n  <p>Hello</p>\n</div>";
    const minified = minifyHtml(original);
    const stats = getHtmlSizeStats(original, minified);
    expect(stats.originalSize).toBeGreaterThan(stats.resultSize);
    expect(stats.reduction).toBeGreaterThan(0);
  });

  it("handles self-closing tags without increasing depth", () => {
    const input = "<div><br><p>Text</p></div>";
    const formatted = formatHtml(input);
    const lines = formatted.trim().split("\n");
    // br and p should be at the same indentation level
    const brLine = lines.find((l) => l.includes("<br>"));
    const pLine = lines.find((l) => l.includes("<p>"));
    expect(brLine?.match(/^\s*/)?.[0].length).toBe(pLine?.match(/^\s*/)?.[0].length);
  });
});
