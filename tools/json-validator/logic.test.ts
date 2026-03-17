import { describe, it, expect } from "vitest";
import { validateJson, formatJson } from "./logic";

describe("json-validator", () => {
  it("validates correct JSON", () => {
    const result = validateJson('{"name":"John","age":30}');
    expect(result.valid).toBe(true);
    expect(result.stats).toBeDefined();
    expect(result.stats!.keyCount).toBe(2);
  });

  it("reports invalid JSON", () => {
    const result = validateJson("{invalid}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error!.message).toBeTruthy();
  });

  it("reports empty input", () => {
    const result = validateJson("");
    expect(result.valid).toBe(false);
    expect(result.error!.message).toBe("Input is empty");
  });

  it("reports whitespace-only input", () => {
    const result = validateJson("   ");
    expect(result.valid).toBe(false);
  });

  it("calculates depth", () => {
    const result = validateJson('{"a":{"b":{"c":1}}}');
    expect(result.valid).toBe(true);
    expect(result.stats!.depth).toBe(3);
  });

  it("collects key paths", () => {
    const result = validateJson('{"a":{"b":1},"c":[1,2]}');
    expect(result.valid).toBe(true);
    expect(result.keyPaths).toContain("a");
    expect(result.keyPaths).toContain("a.b");
    expect(result.keyPaths).toContain("c");
    expect(result.keyPaths).toContain("c[0]");
    expect(result.keyPaths).toContain("c[1]");
  });

  it("handles arrays at root", () => {
    const result = validateJson("[1,2,3]");
    expect(result.valid).toBe(true);
    expect(result.stats!.nodeCount).toBe(4); // array + 3 items
  });

  it("formats JSON", () => {
    const result = formatJson('{"a":1}');
    expect(result).toBe('{\n  "a": 1\n}');
  });

  it("throws on format of invalid JSON", () => {
    expect(() => formatJson("{invalid}")).toThrow();
  });

  it("provides line/column for errors when possible", () => {
    const result = validateJson('{\n  "a": 1,\n  "b": }');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
