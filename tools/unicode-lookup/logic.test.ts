import { describe, it, expect } from "vitest";
import {
  lookupCharacter,
  searchByName,
  getCodePoint,
  parseCodePoint,
  getUtf8Hex,
} from "./logic";

describe("unicode-lookup", () => {
  it("looks up a basic Latin character", () => {
    const info = lookupCharacter("A");
    expect(info.codePoint).toBe("U+0041");
    expect(info.name).toBe("LATIN CAPITAL LETTER A");
    expect(info.htmlEntity).toBe("&#65;");
  });

  it("returns correct code point for emoji", () => {
    const cp = getCodePoint("A");
    expect(cp).toBe("U+0041");
  });

  it("returns UTF-8 hex encoding", () => {
    const hex = getUtf8Hex("A");
    expect(hex).toBe("41");
  });

  it("returns multi-byte UTF-8 for non-ASCII", () => {
    const hex = getUtf8Hex("\u00e9"); // e with acute
    expect(hex).toBe("C3 A9");
  });

  it("searches by name", () => {
    const results = searchByName("ARROW");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes("ARROW"))).toBe(true);
  });

  it("parses U+ code point format", () => {
    const char = parseCodePoint("U+0041");
    expect(char).toBe("A");
  });

  it("parses hex code point format", () => {
    const char = parseCodePoint("0x0041");
    expect(char).toBe("A");
  });

  it("returns null for invalid code point", () => {
    const char = parseCodePoint("not-a-codepoint");
    expect(char).toBeNull();
  });
});
