import { describe, it, expect } from "vitest";
import { jsonToPython, validateJsonInput } from "./logic";

describe("json-to-python", () => {
  it("generates dataclass for simple object", () => {
    const result = jsonToPython('{"name": "John", "age": 30}');
    expect(result).toContain("@dataclass");
    expect(result).toContain("class Root:");
    expect(result).toContain("name: str");
    expect(result).toContain("age: int");
  });

  it("handles nested objects", () => {
    const result = jsonToPython('{"user": {"name": "John"}}');
    expect(result).toContain("class Root:");
    expect(result).toContain("user: User");
    expect(result).toContain("class User:");
    expect(result).toContain("name: str");
  });

  it("handles arrays of primitives", () => {
    const result = jsonToPython('{"tags": ["a", "b"]}');
    expect(result).toContain("tags: list[str]");
  });

  it("handles arrays of objects", () => {
    const result = jsonToPython('{"items": [{"id": 1}]}');
    expect(result).toContain("items: list[Items]");
    expect(result).toContain("class Items:");
  });

  it("handles boolean type", () => {
    const result = jsonToPython('{"active": true}');
    expect(result).toContain("active: bool");
  });

  it("handles float type", () => {
    const result = jsonToPython('{"price": 9.99}');
    expect(result).toContain("price: float");
  });

  it("handles null value", () => {
    const result = jsonToPython('{"data": null}');
    expect(result).toContain("data: Optional[Any]");
    expect(result).toContain("from typing import Optional, Any");
  });

  it("uses custom root name", () => {
    const result = jsonToPython('{"id": 1}', { rootName: "User" });
    expect(result).toContain("class User:");
  });

  it("converts camelCase to snake_case", () => {
    const result = jsonToPython('{"userName": "John"}');
    expect(result).toContain("user_name: str");
  });

  it("includes dataclass import", () => {
    const result = jsonToPython('{"id": 1}');
    expect(result).toContain("from dataclasses import dataclass");
  });

  it("handles empty object", () => {
    const result = jsonToPython("{}");
    expect(result).toContain("class Root:");
    expect(result).toContain("pass");
  });

  it("validates correct JSON", () => {
    expect(validateJsonInput("{}")).toEqual({ valid: true });
  });

  it("validates incorrect JSON", () => {
    const result = validateJsonInput("{invalid}");
    expect(result.valid).toBe(false);
  });
});
