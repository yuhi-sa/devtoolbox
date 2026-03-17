import { describe, it, expect } from "vitest";
import { markdownToHtml, htmlToMarkdown } from "./logic";

describe("markdown-html", () => {
  it("converts headers", () => {
    expect(markdownToHtml("# Hello")).toContain("<h1>Hello</h1>");
    expect(markdownToHtml("## World")).toContain("<h2>World</h2>");
    expect(markdownToHtml("### Level 3")).toContain("<h3>Level 3</h3>");
  });

  it("converts bold text", () => {
    expect(markdownToHtml("**bold**")).toContain("<strong>bold</strong>");
  });

  it("converts italic text", () => {
    expect(markdownToHtml("*italic*")).toContain("<em>italic</em>");
  });

  it("converts links", () => {
    expect(markdownToHtml("[text](http://example.com)")).toContain('<a href="http://example.com">text</a>');
  });

  it("converts unordered lists", () => {
    const md = "- item 1\n- item 2";
    const html = markdownToHtml(md);
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>item 1</li>");
    expect(html).toContain("<li>item 2</li>");
  });

  it("converts ordered lists", () => {
    const md = "1. first\n2. second";
    const html = markdownToHtml(md);
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>first</li>");
  });

  it("converts code blocks", () => {
    const md = "```js\nconsole.log('hi');\n```";
    const html = markdownToHtml(md);
    expect(html).toContain("<pre><code");
    expect(html).toContain("console.log");
  });

  it("converts inline code", () => {
    expect(markdownToHtml("`code`")).toContain("<code>code</code>");
  });

  it("handles empty input", () => {
    expect(markdownToHtml("")).toBe("");
  });

  it("converts HTML headers back to markdown", () => {
    expect(htmlToMarkdown("<h1>Hello</h1>")).toContain("# Hello");
  });

  it("converts HTML bold back to markdown", () => {
    expect(htmlToMarkdown("<strong>bold</strong>")).toContain("**bold**");
  });
});
