import { describe, it, expect } from "vitest";
import { parseUrl, buildUrl, extractQueryString, decodeQueryString } from "./logic";

describe("url-parser", () => {
  it("parses a full URL", () => {
    const result = parseUrl(
      "https://example.com:8080/path/to/page?foo=bar&baz=qux#section"
    );
    expect(result.protocol).toBe("https");
    expect(result.host).toBe("example.com");
    expect(result.port).toBe("8080");
    expect(result.pathname).toBe("/path/to/page");
    expect(result.queryParams).toEqual([
      { key: "foo", value: "bar" },
      { key: "baz", value: "qux" },
    ]);
    expect(result.hash).toBe("section");
  });

  it("parses a URL without port", () => {
    const result = parseUrl("https://example.com/path");
    expect(result.port).toBe("");
    expect(result.host).toBe("example.com");
  });

  it("parses a URL without query or hash", () => {
    const result = parseUrl("https://example.com");
    expect(result.queryParams).toEqual([]);
    expect(result.hash).toBe("");
  });

  it("builds a URL from parts", () => {
    const url = buildUrl({
      protocol: "https",
      host: "example.com",
      port: "3000",
      pathname: "/api/data",
      queryParams: [{ key: "page", value: "1" }],
      hash: "top",
      origin: "https://example.com:3000",
    });
    expect(url).toBe("https://example.com:3000/api/data?page=1#top");
  });

  it("builds a URL without optional parts", () => {
    const url = buildUrl({
      protocol: "http",
      host: "localhost",
      port: "",
      pathname: "/",
      queryParams: [],
      hash: "",
      origin: "http://localhost",
    });
    expect(url).toBe("http://localhost/");
  });

  it("extracts query string", () => {
    expect(extractQueryString("https://x.com/p?a=1&b=2#h")).toBe("a=1&b=2");
    expect(extractQueryString("https://x.com/p")).toBe("");
  });

  it("decodes query string", () => {
    const result = decodeQueryString("name=hello%20world&key=val");
    expect(result).toEqual([
      { key: "name", value: "hello world" },
      { key: "key", value: "val" },
    ]);
  });
});
