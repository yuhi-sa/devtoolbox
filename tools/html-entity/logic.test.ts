import { describe, it, expect } from "vitest";
import { encodeHtmlEntities, decodeHtmlEntities } from "./logic";

describe("html-entity", () => {
  it("encodes special characters", () => {
    expect(encodeHtmlEntities('&<>"')).toBe("&amp;&lt;&gt;&quot;");
  });

  it("encodes single quotes", () => {
    expect(encodeHtmlEntities("it's")).toBe("it&#39;s");
  });

  it("decodes named entities", () => {
    expect(decodeHtmlEntities("&amp;&lt;&gt;&quot;&#39;")).toBe('&<>"\'');
  });

  it("decodes numeric entities", () => {
    expect(decodeHtmlEntities("&#123;&#125;")).toBe("{}");
  });

  it("decodes hex entities", () => {
    expect(decodeHtmlEntities("&#x41;&#x42;&#x43;")).toBe("ABC");
  });

  it("roundtrips correctly", () => {
    const input = '<script>alert("xss")</script>';
    expect(decodeHtmlEntities(encodeHtmlEntities(input))).toBe(input);
  });

  it("handles empty string", () => {
    expect(encodeHtmlEntities("")).toBe("");
    expect(decodeHtmlEntities("")).toBe("");
  });
});
