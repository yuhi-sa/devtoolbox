import { describe, it, expect } from "vitest";
import { generatePassword, calculateStrength } from "./logic";

describe("password-generator", () => {
  it("generates password of specified length", () => {
    const pw = generatePassword({
      length: 20,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    });
    expect(pw).toHaveLength(20);
  });

  it("generates password with only lowercase", () => {
    const pw = generatePassword({
      length: 100,
      uppercase: false,
      lowercase: true,
      numbers: false,
      symbols: false,
    });
    expect(pw).toMatch(/^[a-z]+$/);
  });

  it("generates password with only numbers", () => {
    const pw = generatePassword({
      length: 100,
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
    });
    expect(pw).toMatch(/^[0-9]+$/);
  });

  it("calculates strength correctly", () => {
    expect(calculateStrength("ab").score).toBeLessThan(3);
    expect(calculateStrength("aB1!aB1!aB1!aB1!").score).toBeGreaterThanOrEqual(4);
  });

  it("falls back to lowercase+numbers when no options", () => {
    const pw = generatePassword({
      length: 50,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
    });
    expect(pw).toMatch(/^[a-z0-9]+$/);
  });
});
