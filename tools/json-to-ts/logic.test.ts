import { describe, it, expect } from "vitest";
import { jsonToTs, validateJsonInput } from "./logic";

describe("json-to-ts", () => {
  it("generates interface for simple object", () => {
    const result = jsonToTs('{"name": "John", "age": 30}');
    expect(result).toContain("export interface Root");
    expect(result).toContain("name: string;");
    expect(result).toContain("age: number;");
  });

  it("generates type when useInterface is false", () => {
    const result = jsonToTs('{"name": "John"}', { useInterface: false });
    expect(result).toContain("export type Root =");
  });

  it("handles nested objects", () => {
    const result = jsonToTs(
      '{"user": {"name": "John", "address": {"city": "NYC"}}}'
    );
    expect(result).toContain("export interface Root");
    expect(result).toContain("user: User;");
    expect(result).toContain("export interface User");
    expect(result).toContain("address: Address;");
    expect(result).toContain("export interface Address");
    expect(result).toContain("city: string;");
  });

  it("handles arrays of primitives", () => {
    const result = jsonToTs('{"tags": ["a", "b", "c"]}');
    expect(result).toContain("tags: string[];");
  });

  it("handles arrays of objects", () => {
    const result = jsonToTs(
      '{"items": [{"id": 1, "name": "a"}, {"id": 2, "name": "b"}]}'
    );
    expect(result).toContain("items: Items[];");
    expect(result).toContain("export interface Items");
  });

  it("uses custom root name", () => {
    const result = jsonToTs('{"id": 1}', { rootName: "MyType" });
    expect(result).toContain("export interface MyType");
  });

  it("handles boolean and null types", () => {
    const result = jsonToTs('{"active": true, "deleted": null}');
    expect(result).toContain("active: boolean;");
    expect(result).toContain("deleted: null;");
  });

  it("validates correct JSON", () => {
    expect(validateJsonInput("{}")).toEqual({ valid: true });
  });

  it("validates incorrect JSON", () => {
    const result = validateJsonInput("{invalid}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
