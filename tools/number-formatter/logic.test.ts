import { describe, it, expect } from "vitest";
import { formatNumber, parseFormattedNumber } from "./logic";

describe("number-formatter", () => {
  it("formats with thousand separators", () => {
    expect(formatNumber("1234567")).toBe("1,234,567");
  });

  it("formats with decimal places", () => {
    expect(formatNumber("3.14159", { decimalPlaces: 2 })).toBe("3.14");
  });

  it("formats with currency prefix", () => {
    expect(formatNumber("1000", { currencySymbol: "$", decimalPlaces: 2 })).toBe("$1,000.00");
  });

  it("formats with currency suffix", () => {
    expect(formatNumber("1000", { currencySymbol: "€", currencyPosition: "suffix", decimalPlaces: 2 })).toBe("1,000.00€");
  });

  it("formats scientific notation", () => {
    expect(formatNumber("12345", { notation: "scientific", decimalPlaces: 2 })).toBe("1.23e+4");
  });

  it("formats compact notation", () => {
    expect(formatNumber("1500000", { notation: "compact" })).toBe("1.5M");
  });

  it("formats compact thousands", () => {
    expect(formatNumber("2500", { notation: "compact" })).toBe("2.5K");
  });

  it("handles negative numbers", () => {
    expect(formatNumber("-1234567")).toBe("-1,234,567");
  });

  it("throws on invalid input", () => {
    expect(() => formatNumber("abc")).toThrow("Invalid number");
  });

  it("parses formatted numbers", () => {
    expect(parseFormattedNumber("$1,234.56")).toBe(1234.56);
  });
});
