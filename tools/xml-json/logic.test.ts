import { describe, it, expect } from "vitest";
import { xmlToJson, jsonToXml } from "./logic";

describe("xml-json", () => {
  it("converts simple XML to JSON", () => {
    const xml = "<root><name>test</name></root>";
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root.name).toBe("test");
  });

  it("converts XML with attributes", () => {
    const xml = '<root id="1"><name>test</name></root>';
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root["@id"]).toBe("1");
  });

  it("converts nested XML", () => {
    const xml = "<root><parent><child>value</child></parent></root>";
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root.parent.child).toBe("value");
  });

  it("handles self-closing tags", () => {
    const xml = "<root><empty /></root>";
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root.empty).toBeNull();
  });

  it("converts JSON to XML", () => {
    const json = '{"root": {"name": "test"}}';
    const xml = jsonToXml(json);
    expect(xml).toContain("<root>");
    expect(xml).toContain("<name>test</name>");
    expect(xml).toContain("</root>");
  });

  it("converts JSON with attributes to XML", () => {
    const json = '{"root": {"@id": "1", "name": "test"}}';
    const xml = jsonToXml(json);
    expect(xml).toContain('id="1"');
  });

  it("handles XML declaration", () => {
    const xml = '<?xml version="1.0"?><root><name>test</name></root>';
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root.name).toBe("test");
  });

  it("throws on empty input", () => {
    expect(() => xmlToJson("")).toThrow();
  });
});
