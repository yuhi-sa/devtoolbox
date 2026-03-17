import { describe, it, expect } from "vitest";
import { generateHtaccess, getDefaultOptions } from "./logic";

describe("htaccess-generator", () => {
  it("returns minimal output for default options", () => {
    const result = generateHtaccess(getDefaultOptions());
    expect(result.trim()).toBe("");
  });

  it("generates force HTTPS rule", () => {
    const opts = { ...getDefaultOptions(), forceHttps: true };
    const result = generateHtaccess(opts);
    expect(result).toContain("RewriteCond %{HTTPS} off");
    expect(result).toContain("https://");
    expect(result).toContain("R=301");
  });

  it("generates force www rule", () => {
    const opts = { ...getDefaultOptions(), forceWww: "www" as const };
    const result = generateHtaccess(opts);
    expect(result).toContain("!^www");
    expect(result).toContain("www.");
  });

  it("generates force non-www rule", () => {
    const opts = { ...getDefaultOptions(), forceWww: "non-www" as const };
    const result = generateHtaccess(opts);
    expect(result).toContain("^www\\.");
  });

  it("generates redirect rules", () => {
    const opts = {
      ...getDefaultOptions(),
      redirects: [{ from: "/old", to: "/new", type: "301" as const }],
    };
    const result = generateHtaccess(opts);
    expect(result).toContain("Redirect 301 /old /new");
  });

  it("generates custom error pages", () => {
    const opts = {
      ...getDefaultOptions(),
      errorPages: [{ code: "404", page: "/404.html" }],
    };
    const result = generateHtaccess(opts);
    expect(result).toContain("ErrorDocument 404 /404.html");
  });

  it("generates CORS headers", () => {
    const opts = { ...getDefaultOptions(), enableCors: true, corsOrigin: "*" };
    const result = generateHtaccess(opts);
    expect(result).toContain("Access-Control-Allow-Origin");
    expect(result).toContain('"*"');
  });

  it("generates caching rules", () => {
    const opts = { ...getDefaultOptions(), enableCaching: true, cacheDays: 7 };
    const result = generateHtaccess(opts);
    expect(result).toContain("ExpiresActive On");
    expect(result).toContain("7 days");
    expect(result).toContain("max-age=604800");
  });

  it("generates gzip compression", () => {
    const opts = { ...getDefaultOptions(), enableGzip: true };
    const result = generateHtaccess(opts);
    expect(result).toContain("mod_deflate.c");
    expect(result).toContain("DEFLATE");
  });

  it("generates deny dot files", () => {
    const opts = { ...getDefaultOptions(), denyDotFiles: true };
    const result = generateHtaccess(opts);
    expect(result).toContain("Deny from all");
  });
});
