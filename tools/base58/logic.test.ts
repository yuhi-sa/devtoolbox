import { describe, it, expect } from "vitest";
import {
  base58Encode,
  base58Decode,
  base58EncodeBytes,
  base58DecodeToBytes,
  base58CheckEncode,
  base58CheckDecode,
  bytesToHex,
  hexToBytes,
} from "./logic";

describe("base58", () => {
  it("encodes a simple string", () => {
    const encoded = base58Encode("Hello World");
    expect(encoded).toBe("JxF12TrwUP45BMd");
  });

  it("decodes back to original string", () => {
    const decoded = base58Decode("JxF12TrwUP45BMd");
    expect(decoded).toBe("Hello World");
  });

  it("roundtrips arbitrary text", () => {
    const text = "The quick brown fox";
    expect(base58Decode(base58Encode(text))).toBe(text);
  });

  it("handles empty input", () => {
    expect(base58Encode("")).toBe("");
    expect(base58Decode("")).toBe("");
  });

  it("encodes bytes with leading zeros", () => {
    const bytes = new Uint8Array([0, 0, 1, 2, 3]);
    const encoded = base58EncodeBytes(bytes);
    expect(encoded.startsWith("11")).toBe(true); // leading 1s for zero bytes
  });

  it("decodes preserving leading zeros", () => {
    const bytes = new Uint8Array([0, 0, 1, 2, 3]);
    const encoded = base58EncodeBytes(bytes);
    const decoded = base58DecodeToBytes(encoded);
    expect(Array.from(decoded)).toEqual(Array.from(bytes));
  });

  it("throws on invalid base58 character", () => {
    expect(() => base58Decode("0OIl")).toThrow(); // 0, O, I, l not in alphabet
  });

  it("bytesToHex and hexToBytes roundtrip", () => {
    const hex = "48656c6c6f";
    const bytes = hexToBytes(hex);
    expect(bytesToHex(bytes)).toBe(hex);
  });

  it("hexToBytes throws on invalid hex", () => {
    expect(() => hexToBytes("abc")).toThrow(); // odd length
  });

  it("base58Check encode/decode roundtrip", async () => {
    const payload = new TextEncoder().encode("test");
    const encoded = await base58CheckEncode(payload, 0);
    const decoded = await base58CheckDecode(encoded);
    expect(decoded.version).toBe(0);
    expect(new TextDecoder().decode(decoded.payload)).toBe("test");
  });

  it("base58Check fails on tampered input", async () => {
    const payload = new TextEncoder().encode("test");
    const encoded = await base58CheckEncode(payload, 0);
    // Tamper with last character
    const chars = encoded.split("");
    chars[chars.length - 1] = chars[chars.length - 1] === "1" ? "2" : "1";
    const tampered = chars.join("");
    await expect(base58CheckDecode(tampered)).rejects.toThrow("checksum");
  });
});
