const SELF_CLOSING_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

export function isSelfClosingTag(tagName: string): boolean {
  return SELF_CLOSING_TAGS.has(tagName.toLowerCase());
}

export function formatHtml(html: string, indentSize: number = 2): string {
  if (!html.trim()) return "";
  const indent = " ".repeat(indentSize);

  // Normalize whitespace between tags
  let normalized = html.replace(/>\s+</g, ">\n<").trim();
  const lines = normalized.split("\n");
  let depth = 0;
  const result: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check if line is a closing tag
    const isClosing = /^<\//.test(line);
    // Check if line is an opening tag (not self-closing, not void)
    const openMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    const isSelfClose = /\/>$/.test(line);
    const tagName = openMatch ? openMatch[1] : "";
    const isVoid = tagName ? isSelfClosingTag(tagName) : false;

    if (isClosing) {
      depth = Math.max(0, depth - 1);
    }

    result.push(indent.repeat(depth) + line);

    if (openMatch && !isClosing && !isSelfClose && !isVoid) {
      depth++;
    }
  }

  return result.join("\n") + "\n";
}

export function minifyHtml(html: string): string {
  if (!html.trim()) return "";
  let result = html;
  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, "><");
  // Collapse internal whitespace
  result = result.replace(/\s+/g, " ");
  return result.trim();
}

export interface HtmlSizeStats {
  originalSize: number;
  resultSize: number;
  reduction: number;
  reductionPercent: number;
}

export function getHtmlSizeStats(original: string, result: string): HtmlSizeStats {
  const originalSize = new TextEncoder().encode(original).length;
  const resultSize = new TextEncoder().encode(result).length;
  const reduction = originalSize - resultSize;
  const reductionPercent =
    originalSize === 0 ? 0 : Math.round((reduction / originalSize) * 10000) / 100;
  return { originalSize, resultSize, reduction, reductionPercent };
}
