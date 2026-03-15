import { describe, it, expect } from "vitest";
import { generatePlaceholderSvg, generateDataUrl } from "./logic";

describe("placeholder-image", () => {
  it("generates SVG with correct dimensions", () => {
    const svg = generatePlaceholderSvg({ width: 300, height: 200 });
    expect(svg).toContain('width="300"');
    expect(svg).toContain('height="200"');
  });

  it("uses default text showing dimensions", () => {
    const svg = generatePlaceholderSvg({ width: 640, height: 480 });
    expect(svg).toContain("640 x 480");
  });

  it("uses custom text when provided", () => {
    const svg = generatePlaceholderSvg({
      width: 100,
      height: 100,
      text: "Logo",
    });
    expect(svg).toContain("Logo");
    expect(svg).not.toContain("100 x 100");
  });

  it("uses custom colors", () => {
    const svg = generatePlaceholderSvg({
      width: 100,
      height: 100,
      bgColor: "#FF0000",
      textColor: "#FFFFFF",
    });
    expect(svg).toContain("#FF0000");
    expect(svg).toContain("#FFFFFF");
  });

  it("generates a valid data URL", () => {
    const svg = generatePlaceholderSvg({ width: 50, height: 50 });
    const dataUrl = generateDataUrl(svg);
    expect(dataUrl).toMatch(/^data:image\/svg\+xml,/);
  });

  it("escapes XML special characters in text", () => {
    const svg = generatePlaceholderSvg({
      width: 100,
      height: 100,
      text: '<script>alert("xss")</script>',
    });
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });
});
