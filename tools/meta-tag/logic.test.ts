import { describe, it, expect } from "vitest";
import { generateMetaTags, generateOgpPreview } from "./logic";

describe("meta-tag", () => {
  it("generates basic meta tags with title and description", () => {
    const result = generateMetaTags({
      title: "My Page",
      description: "A test page",
    });
    expect(result).toContain('<meta property="og:title" content="My Page" />');
    expect(result).toContain(
      '<meta property="og:description" content="A test page" />'
    );
    expect(result).toContain('<meta name="twitter:title" content="My Page" />');
  });

  it("includes og:url when url is provided", () => {
    const result = generateMetaTags({
      title: "Test",
      description: "Desc",
      url: "https://example.com",
    });
    expect(result).toContain(
      '<meta property="og:url" content="https://example.com" />'
    );
  });

  it("uses summary_large_image twitter card when image is provided", () => {
    const result = generateMetaTags({
      title: "Test",
      description: "Desc",
      imageUrl: "https://example.com/img.png",
    });
    expect(result).toContain(
      '<meta name="twitter:card" content="summary_large_image" />'
    );
    expect(result).toContain(
      '<meta name="twitter:image" content="https://example.com/img.png" />'
    );
  });

  it("uses summary twitter card when no image is provided", () => {
    const result = generateMetaTags({
      title: "Test",
      description: "Desc",
    });
    expect(result).toContain(
      '<meta name="twitter:card" content="summary" />'
    );
  });

  it("escapes HTML special characters", () => {
    const result = generateMetaTags({
      title: 'Title with "quotes" & <tags>',
      description: "Safe desc",
    });
    expect(result).toContain("&quot;quotes&quot;");
    expect(result).toContain("&amp;");
    expect(result).toContain("&lt;tags&gt;");
  });

  it("generates OGP preview with defaults", () => {
    const preview = generateOgpPreview({
      title: "My Site",
      description: "Desc",
    });
    expect(preview.title).toBe("My Site");
    expect(preview.url).toBe("https://example.com");
    expect(preview.type).toBe("website");
  });

  it("includes site name in meta tags", () => {
    const result = generateMetaTags({
      title: "Test",
      description: "Desc",
      siteName: "MySite",
    });
    expect(result).toContain(
      '<meta property="og:site_name" content="MySite" />'
    );
  });
});
