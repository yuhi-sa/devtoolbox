import { describe, it, expect } from "vitest";
import { hexEncode, hexDecode } from "./logic";

describe("hex-encoder", () => {
  it("encodes text to hex", () => {
    expect(hexEncode("Hello")).toBe("48 65 6c 6c 6f");
  });

  it("decodes hex to text", () => {
    expect(hexDecode("48 65 6c 6c 6f")).toBe("Hello");
  });

  it("handles hex without spaces", () => {
    expect(hexDecode("48656c6c6f")).toBe("Hello");
  });

  it("roundtrips correctly", () => {
    const input = "Test 123!";
    expect(hexDecode(hexEncode(input).replace(/ /g, ""))).toBe(input);
  });

  it("handles empty string", () => {
    expect(hexEncode("")).toBe("");
    expect(hexDecode("")).toBe("");
  });

  it("throws on invalid hex", () => {
    expect(() => hexDecode("GG")).toThrow("non-hex");
  });

  it("throws on odd-length hex", () => {
    expect(() => hexDecode("4")).toThrow("odd number");
  });
});
