import { describe, it, expect } from "vitest";
import { searchEmojis, getCategories, EMOJI_LIST } from "./logic";

describe("emoji-picker", () => {
  it("has at least 100 emojis", () => {
    expect(EMOJI_LIST.length).toBeGreaterThanOrEqual(100);
  });

  it("returns all emojis with no filter", () => {
    const results = searchEmojis("");
    expect(results.length).toBe(EMOJI_LIST.length);
  });

  it("filters by search query", () => {
    const results = searchEmojis("heart");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(
        r.name.toLowerCase().includes("heart") ||
        r.emoji.includes("heart") ||
        r.codePoint.toLowerCase().includes("heart")
      ).toBe(true);
    });
  });

  it("filters by category", () => {
    const results = searchEmojis("", "Smileys");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.category).toBe("Smileys");
    });
  });

  it("filters by both query and category", () => {
    const results = searchEmojis("face", "Smileys");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.category).toBe("Smileys");
      expect(r.name.toLowerCase()).toContain("face");
    });
  });

  it("returns categories", () => {
    const cats = getCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect(cats).toContain("Smileys");
    expect(cats).toContain("Animals");
  });

  it("each emoji has required fields", () => {
    EMOJI_LIST.forEach((e) => {
      expect(e.emoji).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.category).toBeTruthy();
      expect(e.codePoint).toBeTruthy();
    });
  });
});
