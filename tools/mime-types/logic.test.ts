import { describe, it, expect } from "vitest";
import { searchMimeTypes, getCategories, MIME_TYPES } from "./logic";

describe("mime-types", () => {
  it("returns all entries when query is empty", () => {
    expect(searchMimeTypes("")).toEqual(MIME_TYPES);
  });

  it("has at least 90 entries", () => {
    expect(MIME_TYPES.length).toBeGreaterThanOrEqual(90);
  });

  it("searches by extension", () => {
    const results = searchMimeTypes(".json");
    expect(results.some((m) => m.mimeType === "application/json")).toBe(true);
  });

  it("searches by mime type", () => {
    const results = searchMimeTypes("image/png");
    expect(results.some((m) => m.extension === ".png")).toBe(true);
  });

  it("searches by category", () => {
    const results = searchMimeTypes("audio");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((m) => m.category === "Audio" || m.mimeType.includes("audio"))).toBe(true);
  });

  it("searches case-insensitively", () => {
    const results = searchMimeTypes("PDF");
    expect(results.some((m) => m.extension === ".pdf")).toBe(true);
  });

  it("returns empty array for no match", () => {
    expect(searchMimeTypes("zzzznotamime")).toEqual([]);
  });

  it("getCategories returns unique categories", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});
