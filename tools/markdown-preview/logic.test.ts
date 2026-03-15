import { describe, it, expect } from "vitest";
import { parseMarkdown } from "./logic";

describe("markdown-preview", () => {
  it("converts headers", () => {
    expect(parseMarkdown("# Title")).toContain("<h1>Title</h1>");
    expect(parseMarkdown("## Subtitle")).toContain("<h2>Subtitle</h2>");
  });

  it("converts bold text", () => {
    expect(parseMarkdown("**bold**")).toContain("<strong>bold</strong>");
  });

  it("converts italic text", () => {
    expect(parseMarkdown("*italic*")).toContain("<em>italic</em>");
  });

  it("converts links", () => {
    const result = parseMarkdown("[text](https://example.com)");
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain("text");
  });

  it("converts inline code", () => {
    expect(parseMarkdown("`code`")).toContain("<code>code</code>");
  });

  it("converts code blocks", () => {
    const result = parseMarkdown("```js\nconsole.log('hi');\n```");
    expect(result).toContain("<pre><code>");
    expect(result).toContain("console.log(&#39;hi&#39;);");
  });
});
