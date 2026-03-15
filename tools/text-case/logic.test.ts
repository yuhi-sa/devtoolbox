import { describe, it, expect } from "vitest";
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toKebabCase,
  toTitleCase,
  convertAllCases,
} from "./logic";

describe("text-case", () => {
  it("converts to camelCase", () => {
    expect(toCamelCase("hello world")).toBe("helloWorld");
    expect(toCamelCase("hello_world")).toBe("helloWorld");
    expect(toCamelCase("HelloWorld")).toBe("helloWorld");
  });

  it("converts to PascalCase", () => {
    expect(toPascalCase("hello world")).toBe("HelloWorld");
    expect(toPascalCase("hello_world")).toBe("HelloWorld");
  });

  it("converts to snake_case", () => {
    expect(toSnakeCase("helloWorld")).toBe("hello_world");
    expect(toSnakeCase("Hello World")).toBe("hello_world");
  });

  it("converts to SCREAMING_SNAKE_CASE", () => {
    expect(toScreamingSnakeCase("helloWorld")).toBe("HELLO_WORLD");
    expect(toScreamingSnakeCase("hello-world")).toBe("HELLO_WORLD");
  });

  it("converts to kebab-case", () => {
    expect(toKebabCase("helloWorld")).toBe("hello-world");
    expect(toKebabCase("HELLO_WORLD")).toBe("hello-world");
  });

  it("converts to Title Case", () => {
    expect(toTitleCase("hello_world")).toBe("Hello World");
    expect(toTitleCase("helloWorld")).toBe("Hello World");
  });

  it("handles empty input", () => {
    expect(toCamelCase("")).toBe("");
    expect(toPascalCase("")).toBe("");
  });

  it("convertAllCases returns all conversions", () => {
    const result = convertAllCases("hello world");
    expect(result.camelCase).toBe("helloWorld");
    expect(result.pascalCase).toBe("HelloWorld");
    expect(result.snakeCase).toBe("hello_world");
    expect(result.screamingSnakeCase).toBe("HELLO_WORLD");
    expect(result.kebabCase).toBe("hello-world");
  });
});
