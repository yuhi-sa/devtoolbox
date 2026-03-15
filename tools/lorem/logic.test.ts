import { describe, it, expect } from "vitest";
import { generateLorem, generateWords, generateSentences, generateParagraphs } from "./logic";

describe("lorem", () => {
  it("generates words starting with Lorem ipsum", () => {
    const result = generateWords(5, true);
    expect(result).toBe("Lorem ipsum dolor sit amet");
  });

  it("generates the correct number of words", () => {
    const result = generateWords(10, false);
    expect(result.split(" ").length).toBe(10);
  });

  it("generates sentences starting with Lorem ipsum", () => {
    const result = generateSentences(1, true);
    expect(result).toContain("Lorem ipsum dolor sit amet");
    expect(result.endsWith(".")).toBe(true);
  });

  it("generates multiple paragraphs separated by double newlines", () => {
    const result = generateParagraphs(3, true);
    expect(result.split("\n\n").length).toBe(3);
  });

  it("generates via mode selector", () => {
    expect(generateLorem("words", 5, true)).toContain("Lorem");
    expect(generateLorem("sentences", 2, true)).toContain(".");
    expect(generateLorem("paragraphs", 2, true).split("\n\n").length).toBe(2);
  });

  it("returns empty string for zero or negative count", () => {
    expect(generateLorem("words", 0)).toBe("");
    expect(generateLorem("paragraphs", -1)).toBe("");
  });
});
