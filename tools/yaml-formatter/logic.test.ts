import { describe, it, expect } from "vitest";
import {
  parseYaml,
  stringifyYaml,
  formatYaml,
  validateYaml,
  yamlToJson,
  jsonToYaml,
} from "./logic";

describe("yaml-formatter", () => {
  it("parses simple key-value pairs", () => {
    const result = parseYaml("name: hello\nage: 30");
    expect(result).toEqual({ name: "hello", age: 30 });
  });

  it("parses nested objects", () => {
    const result = parseYaml("person:\n  name: John\n  age: 25");
    expect(result).toEqual({ person: { name: "John", age: 25 } });
  });

  it("parses arrays", () => {
    const result = parseYaml("items:\n  - apple\n  - banana\n  - cherry");
    expect(result).toEqual({ items: ["apple", "banana", "cherry"] });
  });

  it("parses booleans and null", () => {
    const result = parseYaml("active: true\ndeleted: false\nvalue: null");
    expect(result).toEqual({ active: true, deleted: false, value: null });
  });

  it("converts YAML to JSON", () => {
    const result = yamlToJson("name: test\ncount: 42");
    expect(JSON.parse(result)).toEqual({ name: "test", count: 42 });
  });

  it("converts JSON to YAML", () => {
    const result = jsonToYaml('{"name":"test","count":42}');
    expect(result).toContain("name: test");
    expect(result).toContain("count: 42");
  });

  it("validates correct YAML", () => {
    expect(validateYaml("key: value")).toEqual({ valid: true });
  });

  it("stringifies an object back to YAML", () => {
    const yaml = stringifyYaml({ name: "hello", active: true });
    expect(yaml).toContain("name: hello");
    expect(yaml).toContain("active: true");
  });

  it("handles numbers correctly", () => {
    const result = parseYaml("integer: 42\nfloat: 3.14");
    expect(result).toEqual({ integer: 42, float: 3.14 });
  });
});
