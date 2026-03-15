import { describe, it, expect } from "vitest";
import { validateQrInput, generateQrUrl } from "./logic";

describe("qr-generator", () => {
  it("generates correct QR URL", () => {
    const url = generateQrUrl({ text: "hello", size: 200 });
    expect(url).toBe("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=hello");
  });

  it("encodes special characters in URL", () => {
    const url = generateQrUrl({ text: "https://example.com?q=test&a=1", size: 200 });
    expect(url).toContain("https%3A%2F%2Fexample.com");
  });

  it("validates empty input", () => {
    expect(validateQrInput("")).not.toBeNull();
    expect(validateQrInput("   ")).not.toBeNull();
  });

  it("validates valid input", () => {
    expect(validateQrInput("hello")).toBeNull();
    expect(validateQrInput("https://example.com")).toBeNull();
  });

  it("validates max length", () => {
    const longText = "a".repeat(2001);
    expect(validateQrInput(longText)).not.toBeNull();
  });

  it("supports different sizes", () => {
    const url = generateQrUrl({ text: "test", size: 400 });
    expect(url).toContain("size=400x400");
  });
});
