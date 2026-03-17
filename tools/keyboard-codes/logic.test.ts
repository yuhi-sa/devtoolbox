import { describe, it, expect } from "vitest";
import { extractKeyInfo, searchCommonKeys, COMMON_KEYS } from "./logic";

describe("keyboard-codes", () => {
  it("extracts key info from event", () => {
    const event = { key: "a", code: "KeyA", keyCode: 65, which: 65 };
    const info = extractKeyInfo(event);
    expect(info).toEqual({ key: "a", code: "KeyA", keyCode: 65, which: 65 });
  });

  it("returns all common keys when query is empty", () => {
    expect(searchCommonKeys("")).toEqual(COMMON_KEYS);
  });

  it("searches by label", () => {
    const results = searchCommonKeys("Enter");
    expect(results.some((k) => k.label === "Enter")).toBe(true);
  });

  it("searches by code", () => {
    const results = searchCommonKeys("KeyA");
    expect(results.some((k) => k.code === "KeyA")).toBe(true);
  });

  it("searches by keyCode number", () => {
    const results = searchCommonKeys("13");
    expect(results.some((k) => k.keyCode === 13)).toBe(true);
  });

  it("returns empty for no match", () => {
    expect(searchCommonKeys("zzznotakey")).toEqual([]);
  });

  it("has common keys defined", () => {
    expect(COMMON_KEYS.length).toBeGreaterThan(20);
  });
});
