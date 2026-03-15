import { describe, it, expect } from "vitest";
import { generateFaviconSvg, generateLinkTags } from "./logic";

describe("favicon-generator", () => {
  it("generates valid SVG", () => {
    const svg = generateFaviconSvg({
      character: "F",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
    });
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("F");
  });

  it("uses specified background color", () => {
    const svg = generateFaviconSvg({
      character: "A",
      backgroundColor: "#ff0000",
      textColor: "#000000",
    });
    expect(svg).toContain('fill="#ff0000"');
  });

  it("uses specified text color", () => {
    const svg = generateFaviconSvg({
      character: "A",
      backgroundColor: "#000000",
      textColor: "#00ff00",
    });
    expect(svg).toContain('fill="#00ff00"');
  });

  it("escapes XML special characters", () => {
    const svg = generateFaviconSvg({
      character: "<",
      backgroundColor: "#000",
      textColor: "#fff",
    });
    expect(svg).toContain("&lt;");
    expect(svg).not.toContain("<<");
  });

  it("generates link tags with default path", () => {
    const tags = generateLinkTags();
    expect(tags).toContain('rel="icon"');
    expect(tags).toContain("favicon.svg");
  });

  it("generates link tags with custom data URI", () => {
    const tags = generateLinkTags("data:image/svg+xml,...");
    expect(tags).toContain("data:image/svg+xml,...");
  });
});
