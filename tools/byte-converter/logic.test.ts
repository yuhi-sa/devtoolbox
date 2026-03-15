import { describe, it, expect } from "vitest";
import { convertBytes } from "./logic";

describe("byte-converter", () => {
  it("converts 1 GB to bytes (binary)", () => {
    const results = convertBytes(1, "GB");
    const bytesResult = results.find((r) => r.unit === "B");
    expect(bytesResult?.binary).toBe("1073741824");
  });

  it("converts 1024 MB to 1 GB (binary)", () => {
    const results = convertBytes(1024, "MB");
    const gbResult = results.find((r) => r.unit === "GB");
    expect(gbResult?.binary).toBe("1");
  });

  it("converts 1000 MB to 1 GB (SI)", () => {
    const results = convertBytes(1000, "MB");
    const gbResult = results.find((r) => r.unit === "GB");
    expect(gbResult?.si).toBe("1");
  });

  it("converts 0 correctly", () => {
    const results = convertBytes(0, "B");
    results.forEach((r) => {
      expect(r.binary).toBe("0");
      expect(r.si).toBe("0");
    });
  });

  it("throws on negative value", () => {
    expect(() => convertBytes(-1, "B")).toThrow();
  });
});
