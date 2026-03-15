import { describe, it, expect } from "vitest";
import { formatJson, minifyJson, validateJson } from "./logic";

describe("json-formatter", () => {
  it("formats JSON with default indent", () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it("formats JSON with custom indent", () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toBe('{\n    "a": 1\n}');
  });

  it("minifies JSON", () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}');
    expect(result).toBe('{"a":1,"b":2}');
  });

  it("validates correct JSON", () => {
    expect(validateJson('{"a": 1}')).toEqual({ valid: true });
  });

  it("validates incorrect JSON", () => {
    const result = validateJson("{invalid}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("throws on invalid input for formatJson", () => {
    expect(() => formatJson("not json")).toThrow();
  });
});
