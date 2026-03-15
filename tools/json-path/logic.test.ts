import { describe, it, expect } from "vitest";
import { queryJsonPath } from "./logic";

describe("json-path", () => {
  const json = JSON.stringify({
    store: {
      books: [
        { title: "Book A", price: 10 },
        { title: "Book B", price: 20 },
      ],
      name: "My Store",
    },
  });

  it("queries root", () => {
    const result = queryJsonPath(json, "$");
    expect(result.error).toBeUndefined();
    expect(JSON.parse(result.result)).toHaveProperty("store");
  });

  it("queries nested property", () => {
    const result = queryJsonPath(json, "$.store.name");
    expect(result.result).toBe('"My Store"');
  });

  it("queries array element", () => {
    const result = queryJsonPath(json, "$.store.books[0].title");
    expect(result.result).toBe('"Book A"');
  });

  it("returns error for invalid JSON", () => {
    const result = queryJsonPath("not json", "$.a");
    expect(result.error).toBeDefined();
  });
});
