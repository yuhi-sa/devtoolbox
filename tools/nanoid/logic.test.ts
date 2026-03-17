import { describe, it, expect } from "vitest";
import {
  generateId,
  generateNanoid,
  generateUlidLike,
  generateSnowflakeLike,
  batchGenerate,
  getAlphabet,
} from "./logic";

describe("nanoid", () => {
  it("generates an ID of the specified length", () => {
    const id = generateNanoid(21);
    expect(id).toHaveLength(21);
  });

  it("generates unique IDs", () => {
    const a = generateNanoid();
    const b = generateNanoid();
    expect(a).not.toBe(b);
  });

  it("generates ID with custom length", () => {
    const id = generateNanoid(10);
    expect(id).toHaveLength(10);
  });

  it("throws on invalid length", () => {
    expect(() => generateId(0, "abc")).toThrow();
    expect(() => generateId(257, "abc")).toThrow();
  });

  it("throws on empty alphabet", () => {
    expect(() => generateId(10, "")).toThrow();
  });

  it("generates ID with custom alphabet", () => {
    const id = generateId(10, "abc");
    expect(id).toHaveLength(10);
    for (const ch of id) {
      expect("abc").toContain(ch);
    }
  });

  it("generates ULID-like IDs with 26 characters", () => {
    const ulid = generateUlidLike();
    expect(ulid.length).toBe(26);
  });

  it("generates snowflake-like numeric IDs", () => {
    const sf = generateSnowflakeLike();
    expect(/^\d+$/.test(sf)).toBe(true);
  });

  it("batch generates the correct count", () => {
    const ids = batchGenerate(5, () => generateNanoid());
    expect(ids).toHaveLength(5);
  });

  it("throws on invalid batch count", () => {
    expect(() => batchGenerate(0, () => generateNanoid())).toThrow();
    expect(() => batchGenerate(1001, () => generateNanoid())).toThrow();
  });

  it("getAlphabet returns correct alphabet", () => {
    expect(getAlphabet("hex")).toBe("0123456789abcdef");
  });
});
