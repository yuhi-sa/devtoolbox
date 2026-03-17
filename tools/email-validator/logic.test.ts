import { describe, it, expect } from "vitest";
import { validateEmail, validateEmails } from "./logic";

describe("email-validator", () => {
  it("validates a correct email", () => {
    const result = validateEmail("user@example.com");
    expect(result.isValid).toBe(true);
    expect(result.localPart).toBe("user");
    expect(result.domain).toBe("example.com");
    expect(result.tld).toBe("com");
    expect(result.errors).toEqual([]);
  });

  it("rejects empty email", () => {
    const result = validateEmail("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email is empty");
  });

  it("rejects email without @", () => {
    const result = validateEmail("userexample.com");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Missing @ symbol");
  });

  it("rejects empty local part", () => {
    const result = validateEmail("@example.com");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Local part is empty");
  });

  it("rejects empty domain", () => {
    const result = validateEmail("user@");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Domain is empty");
  });

  it("rejects domain without TLD", () => {
    const result = validateEmail("user@localhost");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Domain must have at least two parts");
  });

  it("rejects local part starting with dot", () => {
    const result = validateEmail(".user@example.com");
    expect(result.isValid).toBe(false);
  });

  it("rejects consecutive dots in local part", () => {
    const result = validateEmail("us..er@example.com");
    expect(result.isValid).toBe(false);
  });

  it("validates emails with special chars in local part", () => {
    const result = validateEmail("user+tag@example.com");
    expect(result.isValid).toBe(true);
  });

  it("batch validates multiple emails", () => {
    const results = validateEmails([
      "good@example.com",
      "bad@",
      "",
      "also-good@test.org",
    ]);
    expect(results.length).toBe(3); // empty string filtered
    expect(results[0].isValid).toBe(true);
    expect(results[1].isValid).toBe(false);
    expect(results[2].isValid).toBe(true);
  });

  it("rejects numeric-only TLD", () => {
    const result = validateEmail("user@example.123");
    expect(result.isValid).toBe(false);
  });
});
