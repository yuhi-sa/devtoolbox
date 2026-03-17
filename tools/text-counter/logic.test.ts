import { describe, it, expect } from "vitest";
import { countTextStats, formatReadingTime } from "./logic";

describe("text-counter", () => {
  it("returns zeros for empty string", () => {
    const stats = countTextStats("");
    expect(stats.characters).toBe(0);
    expect(stats.words).toBe(0);
    expect(stats.sentences).toBe(0);
    expect(stats.paragraphs).toBe(0);
    expect(stats.lines).toBe(0);
    expect(stats.bytes).toBe(0);
    expect(stats.uniqueWords).toBe(0);
    expect(stats.readingTimeSeconds).toBe(0);
  });

  it("counts characters correctly", () => {
    const stats = countTextStats("Hello World");
    expect(stats.characters).toBe(11);
    expect(stats.charactersNoSpaces).toBe(10);
  });

  it("counts words correctly", () => {
    const stats = countTextStats("Hello World foo bar");
    expect(stats.words).toBe(4);
  });

  it("counts sentences correctly", () => {
    const stats = countTextStats("Hello. World! How are you?");
    expect(stats.sentences).toBe(3);
  });

  it("counts paragraphs correctly", () => {
    const stats = countTextStats("First paragraph.\n\nSecond paragraph.\n\nThird.");
    expect(stats.paragraphs).toBe(3);
  });

  it("counts lines correctly", () => {
    const stats = countTextStats("line1\nline2\nline3");
    expect(stats.lines).toBe(3);
  });

  it("counts bytes correctly for ASCII", () => {
    const stats = countTextStats("abc");
    expect(stats.bytes).toBe(3);
  });

  it("counts bytes correctly for multibyte characters", () => {
    const stats = countTextStats("\u3042");
    expect(stats.bytes).toBe(3); // hiragana 'a' is 3 bytes in UTF-8
  });

  it("counts unique words (case-insensitive)", () => {
    const stats = countTextStats("hello Hello world World world");
    expect(stats.uniqueWords).toBe(2);
  });

  it("estimates reading time", () => {
    // 200 words = 1 min = 60 seconds
    const words = Array(200).fill("word").join(" ");
    const stats = countTextStats(words);
    expect(stats.readingTimeSeconds).toBe(60);
  });

  it("formats reading time", () => {
    expect(formatReadingTime(0)).toBe("0s");
    expect(formatReadingTime(30)).toBe("30s");
    expect(formatReadingTime(60)).toBe("1min");
    expect(formatReadingTime(90)).toBe("1min 30s");
  });
});
