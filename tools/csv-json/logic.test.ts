import { describe, it, expect } from "vitest";
import { csvToJson, jsonToCsv } from "./logic";

describe("csv-json", () => {
  it("converts CSV to JSON", () => {
    const csv = "name,age\nAlice,30\nBob,25";
    const result = JSON.parse(csvToJson(csv));
    expect(result).toEqual([
      { name: "Alice", age: "30" },
      { name: "Bob", age: "25" },
    ]);
  });

  it("converts JSON to CSV", () => {
    const json = JSON.stringify([{ name: "Alice", age: "30" }]);
    const csv = jsonToCsv(json);
    expect(csv).toBe("name,age\nAlice,30");
  });

  it("supports tab delimiter", () => {
    const csv = "name\tage\nAlice\t30";
    const result = JSON.parse(csvToJson(csv, "\t"));
    expect(result[0].name).toBe("Alice");
  });

  it("supports semicolon delimiter", () => {
    const csv = "name;age\nAlice;30";
    const result = JSON.parse(csvToJson(csv, ";"));
    expect(result[0].name).toBe("Alice");
  });

  it("handles quoted fields with commas", () => {
    const csv = 'name,city\n"Smith, John","New York"';
    const result = JSON.parse(csvToJson(csv));
    expect(result[0].name).toBe("Smith, John");
    expect(result[0].city).toBe("New York");
  });

  it("throws on invalid JSON for jsonToCsv", () => {
    expect(() => jsonToCsv("not json")).toThrow();
  });
});
