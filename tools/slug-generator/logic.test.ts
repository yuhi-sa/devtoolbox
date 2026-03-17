import { describe, it, expect } from "vitest";
import { generateSlug, transliterateText, defaultOptions } from "./logic";

describe("slug-generator", () => {
  it("generates a basic slug", () => {
    expect(generateSlug("Hello World", defaultOptions)).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(generateSlug("Hello   World", defaultOptions)).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello! @World#", defaultOptions)).toBe("hello-world");
  });

  it("uses underscore separator", () => {
    const opts = { ...defaultOptions, separator: "_" as const };
    expect(generateSlug("Hello World", opts)).toBe("hello_world");
  });

  it("uses dot separator", () => {
    const opts = { ...defaultOptions, separator: "." as const };
    expect(generateSlug("Hello World", opts)).toBe("hello.world");
  });

  it("preserves case when lowercase is false", () => {
    const opts = { ...defaultOptions, lowercase: false };
    expect(generateSlug("Hello World", opts)).toBe("Hello-World");
  });

  it("transliterates accented characters", () => {
    expect(generateSlug("Café résumé", defaultOptions)).toBe("cafe-resume");
  });

  it("transliterates without lowercasing", () => {
    const opts = { ...defaultOptions, lowercase: false };
    expect(generateSlug("Ñoño", opts)).toBe("Nono");
  });

  it("handles empty input", () => {
    expect(generateSlug("", defaultOptions)).toBe("");
    expect(generateSlug("   ", defaultOptions)).toBe("");
  });

  it("respects maxLength", () => {
    const opts = { ...defaultOptions, maxLength: 10 };
    const result = generateSlug("This is a very long title", opts);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result).not.toMatch(/-$/);
  });

  it("removes leading/trailing separators", () => {
    expect(generateSlug("  Hello World  ", defaultOptions)).toBe("hello-world");
  });

  it("transliterates common characters", () => {
    expect(transliterateText("über")).toBe("uber");
    expect(transliterateText("straße")).toBe("strasse");
    expect(transliterateText("naïve")).toBe("naive");
  });

  it("skips transliteration when disabled", () => {
    const opts = { ...defaultOptions, transliterate: false };
    const result = generateSlug("café", opts);
    expect(result).toBe("caf");
  });
});
