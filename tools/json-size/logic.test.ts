import { describe, it, expect } from "vitest";
import { analyzeJsonSize, formatBytes } from "./logic";

describe("json-size", () => {
  it("analyzes a simple object", () => {
    const input = '{"name":"John","age":30}';
    const result = analyzeJsonSize(input);
    expect(result.keyCount).toBe(2);
    expect(result.maxDepth).toBe(1);
    expect(result.dataTypes["string"]).toBe(1);
    expect(result.dataTypes["number"]).toBe(1);
  });

  it("analyzes nested objects", () => {
    const input = '{"a":{"b":{"c":1}}}';
    const result = analyzeJsonSize(input);
    expect(result.maxDepth).toBe(3);
    expect(result.keyCount).toBe(3);
  });

  it("analyzes arrays", () => {
    const input = "[1,2,3]";
    const result = analyzeJsonSize(input);
    expect(result.arrayCount).toBe(1);
    expect(result.dataTypes["number"]).toBe(3);
  });

  it("counts null values", () => {
    const input = '{"a":null}';
    const result = analyzeJsonSize(input);
    expect(result.dataTypes["null"]).toBe(1);
  });

  it("calculates minified vs formatted size", () => {
    const input = '{ "a" : 1 , "b" : 2 }';
    const result = analyzeJsonSize(input);
    expect(result.minifiedSize).toBeLessThan(result.formattedSize);
  });

  it("throws on invalid JSON", () => {
    expect(() => analyzeJsonSize("{invalid}")).toThrow();
  });

  it("formats bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(100)).toBe("100 B");
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(1536)).toBe("1.50 KB");
  });
});
