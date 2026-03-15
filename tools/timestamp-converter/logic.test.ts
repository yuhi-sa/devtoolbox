import { describe, it, expect } from "vitest";
import {
  timestampToIso,
  isoToTimestamp,
  getCurrentTimestamp,
} from "./logic";

describe("timestamp-converter", () => {
  it("converts timestamp to ISO string", () => {
    expect(timestampToIso(0)).toBe("1970-01-01T00:00:00.000Z");
  });

  it("converts ISO string to timestamp", () => {
    expect(isoToTimestamp("1970-01-01T00:00:00.000Z")).toBe(0);
  });

  it("roundtrips correctly", () => {
    const ts = 1700000000;
    expect(isoToTimestamp(timestampToIso(ts))).toBe(ts);
  });

  it("returns current timestamp as a number", () => {
    const now = getCurrentTimestamp();
    expect(typeof now).toBe("number");
    expect(now).toBeGreaterThan(0);
  });

  it("throws on invalid timestamp", () => {
    expect(() => timestampToIso(NaN)).toThrow();
  });

  it("throws on invalid ISO string", () => {
    expect(() => isoToTimestamp("not-a-date")).toThrow();
  });
});
