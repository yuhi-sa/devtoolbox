import { describe, it, expect } from "vitest";
import { rot13 } from "./logic";

describe("rot13", () => {
  it("encodes lowercase letters", () => {
    expect(rot13("hello")).toBe("uryyb");
  });

  it("encodes uppercase letters", () => {
    expect(rot13("HELLO")).toBe("URYYB");
  });

  it("is its own inverse", () => {
    const input = "Hello, World!";
    expect(rot13(rot13(input))).toBe(input);
  });

  it("preserves non-alphabetic characters", () => {
    expect(rot13("123 !@#")).toBe("123 !@#");
  });

  it("handles empty string", () => {
    expect(rot13("")).toBe("");
  });

  it("encodes the full alphabet", () => {
    expect(rot13("abcdefghijklmnopqrstuvwxyz")).toBe("nopqrstuvwxyzabcdefghijklm");
  });
});
