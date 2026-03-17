import { describe, it, expect } from "vitest";
import { jsonToGo, validateJsonInput } from "./logic";

describe("json-to-go", () => {
  it("generates struct for simple object", () => {
    const result = jsonToGo('{"name": "John", "age": 30}');
    expect(result).toContain("type Root struct {");
    expect(result).toContain('Name string `json:"name"`');
    expect(result).toContain('Age int64 `json:"age"`');
  });

  it("handles nested objects", () => {
    const result = jsonToGo('{"user": {"name": "John"}}');
    expect(result).toContain("type Root struct {");
    expect(result).toContain('User User `json:"user"`');
    expect(result).toContain("type User struct {");
    expect(result).toContain('Name string `json:"name"`');
  });

  it("handles arrays of primitives", () => {
    const result = jsonToGo('{"tags": ["a", "b"]}');
    expect(result).toContain('Tags []string `json:"tags"`');
  });

  it("handles arrays of objects", () => {
    const result = jsonToGo('{"items": [{"id": 1}]}');
    expect(result).toContain('Items []Items `json:"items"`');
    expect(result).toContain("type Items struct {");
  });

  it("handles boolean type", () => {
    const result = jsonToGo('{"active": true}');
    expect(result).toContain('Active bool `json:"active"`');
  });

  it("handles float type", () => {
    const result = jsonToGo('{"price": 9.99}');
    expect(result).toContain('Price float64 `json:"price"`');
  });

  it("handles null value", () => {
    const result = jsonToGo('{"data": null}');
    expect(result).toContain('Data interface{} `json:"data"`');
  });

  it("uses custom root name", () => {
    const result = jsonToGo('{"id": 1}', { rootName: "User" });
    expect(result).toContain("type User struct {");
  });

  it("handles empty array", () => {
    const result = jsonToGo("[]");
    expect(result).toContain("[]interface{}");
  });

  it("converts snake_case to PascalCase field names", () => {
    const result = jsonToGo('{"user_name": "John"}');
    expect(result).toContain("UserName string");
  });

  it("handles ID acronym", () => {
    const result = jsonToGo('{"user_id": 1}');
    expect(result).toContain("UserID int64");
  });

  it("validates correct JSON", () => {
    expect(validateJsonInput("{}")).toEqual({ valid: true });
  });

  it("validates incorrect JSON", () => {
    const result = validateJsonInput("{invalid}");
    expect(result.valid).toBe(false);
  });
});
