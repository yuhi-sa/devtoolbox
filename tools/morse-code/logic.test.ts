import { describe, it, expect } from "vitest";
import { textToMorse, morseToText } from "./logic";

describe("morse-code", () => {
  it("encodes text to morse", () => {
    expect(textToMorse("SOS")).toBe("... --- ...");
  });

  it("decodes morse to text", () => {
    expect(morseToText("... --- ...")).toBe("SOS");
  });

  it("handles spaces between words", () => {
    expect(textToMorse("HI THERE")).toBe(".... .. / - .... . .-. .");
  });

  it("decodes words separated by slash", () => {
    expect(morseToText(".... .. / - .... . .-. .")).toBe("HI THERE");
  });

  it("handles numbers", () => {
    expect(textToMorse("123")).toBe(".---- ..--- ...--");
  });

  it("roundtrips correctly", () => {
    const input = "HELLO WORLD";
    expect(morseToText(textToMorse(input))).toBe(input);
  });

  it("throws on unknown morse code", () => {
    expect(() => morseToText("........")).toThrow("Unknown morse code");
  });

  it("handles empty string", () => {
    expect(textToMorse("")).toBe("");
  });
});
