import { describe, it, expect } from "vitest";
import { buildAsciiTable, filterAsciiTable, getDisplayChar, getCharDescription } from "./logic";

describe("ascii-table", () => {
  it("builds a table with 128 entries", () => {
    const table = buildAsciiTable();
    expect(table).toHaveLength(128);
  });

  it("has correct hex values", () => {
    const table = buildAsciiTable();
    expect(table[0].hex).toBe("00");
    expect(table[65].hex).toBe("41");
    expect(table[127].hex).toBe("7F");
  });

  it("returns empty string for control characters", () => {
    expect(getDisplayChar(0)).toBe("");
    expect(getDisplayChar(10)).toBe("");
    expect(getDisplayChar(127)).toBe("");
  });

  it("returns printable characters correctly", () => {
    expect(getDisplayChar(65)).toBe("A");
    expect(getDisplayChar(48)).toBe("0");
    expect(getDisplayChar(32)).toBe(" ");
  });

  it("describes character categories", () => {
    expect(getCharDescription(0)).toContain("NUL");
    expect(getCharDescription(65)).toBe("Uppercase Letter");
    expect(getCharDescription(97)).toBe("Lowercase Letter");
    expect(getCharDescription(48)).toBe("Digit");
    expect(getCharDescription(32)).toBe("Space");
  });

  it("filters by single character", () => {
    const table = buildAsciiTable();
    const result = filterAsciiTable(table, "A");
    expect(result.some((e) => e.decimal === 65)).toBe(true);
  });

  it("filters by decimal number", () => {
    const table = buildAsciiTable();
    const result = filterAsciiTable(table, "65");
    expect(result).toHaveLength(1);
    expect(result[0].character).toBe("A");
  });

  it("filters by description text", () => {
    const table = buildAsciiTable();
    const result = filterAsciiTable(table, "uppercase");
    expect(result.length).toBe(26);
  });
});
