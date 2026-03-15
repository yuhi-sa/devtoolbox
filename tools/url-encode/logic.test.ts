import { describe, it, expect } from "vitest";
import { urlEncode, urlDecode } from "./logic";

describe("url-encode", () => {
  it("encodes special characters", () => {
    expect(urlEncode("hello world")).toBe("hello%20world");
    expect(urlEncode("a=b&c=d")).toBe("a%3Db%26c%3Dd");
  });

  it("decodes encoded string", () => {
    expect(urlDecode("hello%20world")).toBe("hello world");
    expect(urlDecode("a%3Db%26c%3Dd")).toBe("a=b&c=d");
  });

  it("roundtrips correctly", () => {
    const input = "https://example.com/path?q=hello world&lang=ja";
    expect(urlDecode(urlEncode(input))).toBe(input);
  });
});
