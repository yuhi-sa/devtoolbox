import { describe, it, expect } from "vitest";
import {
  jsonEscape,
  jsonUnescape,
  htmlEscape,
  htmlUnescape,
  urlEncode,
  urlDecode,
  unicodeEscape,
  unicodeUnescape,
  backslashEscape,
  backslashUnescape,
} from "./logic";

describe("string-escape", () => {
  it("JSON escapes special characters", () => {
    expect(jsonEscape('hello "world"')).toBe('hello \\"world\\"');
    expect(jsonEscape("line1\nline2")).toBe("line1\\nline2");
  });

  it("JSON unescapes special characters", () => {
    expect(jsonUnescape('hello \\"world\\"')).toBe('hello "world"');
    expect(jsonUnescape("line1\\nline2")).toBe("line1\nline2");
  });

  it("HTML escapes entities", () => {
    expect(htmlEscape('<div class="test">')).toBe(
      "&lt;div class=&quot;test&quot;&gt;"
    );
    expect(htmlEscape("a & b")).toBe("a &amp; b");
  });

  it("HTML unescapes entities", () => {
    expect(htmlUnescape("&lt;div&gt;")).toBe("<div>");
    expect(htmlUnescape("a &amp; b")).toBe("a & b");
  });

  it("URL encodes special characters", () => {
    expect(urlEncode("hello world")).toBe("hello%20world");
    expect(urlEncode("a=b&c=d")).toBe("a%3Db%26c%3Dd");
  });

  it("URL decodes special characters", () => {
    expect(urlDecode("hello%20world")).toBe("hello world");
    expect(urlDecode("a%3Db%26c%3Dd")).toBe("a=b&c=d");
  });

  it("Unicode escapes non-ASCII characters", () => {
    const result = unicodeEscape("hello");
    expect(result).toBe("hello");
    const japanese = unicodeEscape("\u3053\u3093\u306B\u3061\u306F");
    expect(japanese).toContain("\\u");
  });

  it("Unicode unescapes sequences", () => {
    expect(unicodeUnescape("\\u0048\\u0065\\u006c\\u006c\\u006f")).toBe(
      "Hello"
    );
  });

  it("backslash escapes control characters", () => {
    expect(backslashEscape("line1\nline2\ttab")).toBe(
      "line1\\nline2\\ttab"
    );
  });

  it("backslash unescapes control characters", () => {
    expect(backslashUnescape("line1\\nline2\\ttab")).toBe(
      "line1\nline2\ttab"
    );
  });
});
