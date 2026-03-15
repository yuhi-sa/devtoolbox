import { describe, it, expect } from "vitest";
import { convertBase, getBaseLabel } from "./logic";

describe("base-converter", () => {
  it("converts decimal 255 to all bases", () => {
    const result = convertBase("255", 10);
    expect(result.binary).toBe("11111111");
    expect(result.octal).toBe("377");
    expect(result.decimal).toBe("255");
    expect(result.hex).toBe("FF");
  });

  it("converts binary to decimal", () => {
    const result = convertBase("1010", 2);
    expect(result.decimal).toBe("10");
  });

  it("converts hex to decimal", () => {
    const result = convertBase("FF", 16);
    expect(result.decimal).toBe("255");
  });

  it("converts octal to decimal", () => {
    const result = convertBase("17", 8);
    expect(result.decimal).toBe("15");
  });

  it("throws on invalid characters for base", () => {
    expect(() => convertBase("2", 2)).toThrow();
    expect(() => convertBase("8", 8)).toThrow();
    expect(() => convertBase("G", 16)).toThrow();
  });

  it("returns correct base labels", () => {
    expect(getBaseLabel(2)).toContain("Binary");
    expect(getBaseLabel(16)).toContain("Hexadecimal");
  });
});
