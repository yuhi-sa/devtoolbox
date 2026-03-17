import { describe, it, expect } from "vitest";
import { formatXml, minifyXml, validateXml } from "./logic";

describe("xml-formatter", () => {
  it("formats simple XML with indentation", () => {
    const input = "<root><child>text</child></root>";
    const result = formatXml(input);
    expect(result).toContain("  <child>");
    expect(result).toContain("</root>");
  });

  it("formats nested XML", () => {
    const input = "<a><b><c>hello</c></b></a>";
    const result = formatXml(input, 2);
    const lines = result.split("\n");
    expect(lines[0]).toBe("<a>");
    expect(lines[1]).toBe("  <b>");
  });

  it("handles self-closing tags", () => {
    const input = "<root><br/><item/></root>";
    const result = formatXml(input);
    expect(result).toContain("  <br/>");
    expect(result).toContain("  <item/>");
  });

  it("handles XML prolog", () => {
    const input = '<?xml version="1.0"?><root><child/></root>';
    const result = formatXml(input);
    expect(result).toContain("<?xml");
    expect(result).toContain("<root>");
  });

  it("handles CDATA sections", () => {
    const input = "<root><![CDATA[some <data> here]]></root>";
    const result = formatXml(input);
    expect(result).toContain("<![CDATA[some <data> here]]>");
  });

  it("handles empty input", () => {
    expect(formatXml("")).toBe("");
    expect(formatXml("   ")).toBe("");
  });

  it("minifies XML", () => {
    const input = "<root>\n  <child>\n    text\n  </child>\n</root>";
    const result = minifyXml(input);
    expect(result).toBe("<root><child> text </child></root>");
  });

  it("removes comments when minifying", () => {
    const input = "<root><!-- comment --><child/></root>";
    const result = minifyXml(input);
    expect(result).toBe("<root><child/></root>");
  });

  it("validates well-formed XML", () => {
    expect(validateXml("<root><child/></root>")).toEqual({ valid: true });
  });

  it("detects mismatched tags", () => {
    const result = validateXml("<root><child></root>");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("detects unclosed tags", () => {
    const result = validateXml("<root><child>");
    expect(result.valid).toBe(false);
  });

  it("validates empty input", () => {
    expect(validateXml("")).toEqual({ valid: true });
  });

  it("formats with custom indent", () => {
    const input = "<root><child/></root>";
    const result = formatXml(input, 4);
    expect(result).toContain("    <child/>");
  });
});
