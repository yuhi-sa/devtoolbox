import { describe, it, expect } from "vitest";
import {
  punycodeEncode,
  punycodeDecode,
  domainToAce,
  domainFromAce,
} from "./logic";

describe("punycode", () => {
  it("encodes basic ASCII unchanged", () => {
    expect(punycodeEncode("abc")).toBe("abc-");
  });

  it("encodes Unicode string", () => {
    // "München" → "Mnchen-3ya"
    expect(punycodeEncode("München")).toBe("Mnchen-3ya");
  });

  it("decodes Punycode back to Unicode", () => {
    expect(punycodeDecode("Mnchen-3ya")).toBe("München");
  });

  it("roundtrips Unicode strings", () => {
    const cases = ["日本語", "München", "café"];
    for (const c of cases) {
      expect(punycodeDecode(punycodeEncode(c))).toBe(c);
    }
  });

  it("converts domain to ACE form", () => {
    expect(domainToAce("münchen.de")).toBe("xn--mnchen-3ya.de");
  });

  it("converts ACE form back to Unicode domain", () => {
    expect(domainFromAce("xn--mnchen-3ya.de")).toBe("münchen.de");
  });

  it("leaves pure ASCII domains unchanged", () => {
    expect(domainToAce("example.com")).toBe("example.com");
  });

  it("roundtrips domain names", () => {
    const domain = "例え.jp";
    expect(domainFromAce(domainToAce(domain))).toBe(domain);
  });

  it("throws on invalid punycode", () => {
    expect(() => punycodeDecode("ä")).toThrow();
  });
});
