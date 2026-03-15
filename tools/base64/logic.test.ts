import { describe, it, expect } from "vitest";
import { base64Encode, base64Decode } from "./logic";

describe("base64", () => {
  it("encodes plain text", () => {
    expect(base64Encode("Hello, World!")).toBe("SGVsbG8sIFdvcmxkIQ==");
  });

  it("decodes base64", () => {
    expect(base64Decode("SGVsbG8sIFdvcmxkIQ==")).toBe("Hello, World!");
  });

  it("roundtrips correctly", () => {
    const input = "Test string with special chars: &<>\"'";
    expect(base64Decode(base64Encode(input))).toBe(input);
  });

  it("handles empty string", () => {
    expect(base64Encode("")).toBe("");
    expect(base64Decode("")).toBe("");
  });

  it("handles unicode", () => {
    const input = "こんにちは";
    expect(base64Decode(base64Encode(input))).toBe(input);
  });
});
