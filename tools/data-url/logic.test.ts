import { describe, it, expect } from "vitest";
import { textToDataUrl, getDataUrlSize, formatBytes, isValidSvg } from "./logic";

describe("data-url", () => {
  it("generates base64 data URL", () => {
    const result = textToDataUrl("Hello", "text/plain", true);
    expect(result).toBe("data:text/plain;base64,SGVsbG8=");
  });

  it("generates URL-encoded data URL", () => {
    const result = textToDataUrl("Hello World", "text/plain", false);
    expect(result).toBe("data:text/plain,Hello%20World");
  });

  it("handles SVG MIME type", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>';
    const result = textToDataUrl(svg, "image/svg+xml", true);
    expect(result).toContain("data:image/svg+xml;base64,");
  });

  it("returns empty string for empty input", () => {
    expect(textToDataUrl("", "text/plain")).toBe("");
  });

  it("calculates data URL size", () => {
    const url = textToDataUrl("Hello", "text/plain");
    const size = getDataUrlSize(url);
    expect(size.bytes).toBeGreaterThan(0);
    expect(size.formatted).toContain("B");
  });

  it("returns zero size for empty input", () => {
    const size = getDataUrlSize("");
    expect(size.bytes).toBe(0);
    expect(size.formatted).toBe("0 B");
  });

  it("formats bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1536)).toBe("1.50 KB");
    expect(formatBytes(1048576)).toBe("1.00 MB");
  });

  it("validates SVG", () => {
    expect(isValidSvg('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe(true);
    expect(isValidSvg("<div>not svg</div>")).toBe(false);
    expect(isValidSvg("plain text")).toBe(false);
  });

  it("handles unicode in base64", () => {
    const result = textToDataUrl("Héllo", "text/plain", true);
    expect(result).toContain("data:text/plain;base64,");
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles different MIME types", () => {
    const result = textToDataUrl("body{}", "text/css", true);
    expect(result).toContain("data:text/css;base64,");
  });
});
