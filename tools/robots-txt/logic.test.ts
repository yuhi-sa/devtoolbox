import { describe, it, expect } from "vitest";
import { generateRobotsTxt } from "./logic";

describe("robots-txt", () => {
  it("generates basic robots.txt with disallow all", () => {
    const result = generateRobotsTxt({
      rules: [{ userAgent: "*", allow: [], disallow: ["/"] }],
    });
    expect(result).toContain("User-agent: *");
    expect(result).toContain("Disallow: /");
  });

  it("includes sitemap URL", () => {
    const result = generateRobotsTxt({
      rules: [{ userAgent: "*", allow: [], disallow: [] }],
      sitemapUrl: "https://example.com/sitemap.xml",
    });
    expect(result).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("includes crawl-delay", () => {
    const result = generateRobotsTxt({
      rules: [
        { userAgent: "Googlebot", allow: [], disallow: ["/"], crawlDelay: 10 },
      ],
    });
    expect(result).toContain("Crawl-delay: 10");
  });

  it("handles multiple rules", () => {
    const result = generateRobotsTxt({
      rules: [
        { userAgent: "*", allow: [], disallow: ["/admin"] },
        { userAgent: "Googlebot", allow: ["/"], disallow: [] },
      ],
    });
    expect(result).toContain("User-agent: *");
    expect(result).toContain("User-agent: Googlebot");
    expect(result).toContain("Disallow: /admin");
    expect(result).toContain("Allow: /");
  });

  it("includes allow paths", () => {
    const result = generateRobotsTxt({
      rules: [
        { userAgent: "*", allow: ["/public"], disallow: ["/private"] },
      ],
    });
    expect(result).toContain("Allow: /public");
    expect(result).toContain("Disallow: /private");
  });

  it("omits crawl-delay when zero", () => {
    const result = generateRobotsTxt({
      rules: [
        { userAgent: "*", allow: [], disallow: ["/"], crawlDelay: 0 },
      ],
    });
    expect(result).not.toContain("Crawl-delay");
  });
});
