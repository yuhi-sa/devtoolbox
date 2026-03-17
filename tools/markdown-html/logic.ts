export function markdownToHtml(input: string): string {
  if (!input.trim()) return "";

  let html = input;

  // Code blocks (fenced) - must be processed before inline patterns
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = escapeHtml(code.trimEnd());
    const langAttr = lang ? ` class="language-${lang}"` : "";
    return `<pre><code${langAttr}>${escaped}</code></pre>`;
  });

  // Process line-based elements
  const lines = html.split("\n");
  const result: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip pre/code blocks already processed
    if (line.startsWith("<pre>") || line.startsWith("</pre>")) {
      if (inList) { result.push(`</${inList}>`); inList = null; }
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      result.push(line);
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      if (inList) { result.push(`</${inList}>`); inList = null; }
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      const level = headerMatch[1].length;
      result.push(`<h${level}>${processInline(headerMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      if (inList) { result.push(`</${inList}>`); inList = null; }
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      result.push("<hr>");
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      if (inList !== "ul") {
        if (inList) result.push(`</${inList}>`);
        result.push("<ul>");
        inList = "ul";
      }
      result.push(`<li>${processInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      if (inList !== "ol") {
        if (inList) result.push(`</${inList}>`);
        result.push("<ol>");
        inList = "ol";
      }
      result.push(`<li>${processInline(olMatch[1])}</li>`);
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s*(.*)$/);
    if (bqMatch) {
      if (inList) { result.push(`</${inList}>`); inList = null; }
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      result.push(`<blockquote><p>${processInline(bqMatch[1])}</p></blockquote>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      if (inList) { result.push(`</${inList}>`); inList = null; }
      if (inParagraph) { result.push("</p>"); inParagraph = false; }
      continue;
    }

    // Regular text - paragraph
    if (inList) { result.push(`</${inList}>`); inList = null; }
    if (!inParagraph) {
      result.push("<p>");
      inParagraph = true;
    }
    result.push(processInline(line));
  }

  if (inList) result.push(`</${inList}>`);
  if (inParagraph) result.push("</p>");

  return result.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function processInline(text: string): string {
  // Inline code (must be before bold/italic)
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Images
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Bold+Italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // Strikethrough
  text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");

  return text;
}

export function htmlToMarkdown(input: string): string {
  let md = input;

  // Headers
  for (let i = 6; i >= 1; i--) {
    const re = new RegExp(`<h${i}>([\\s\\S]*?)<\\/h${i}>`, "gi");
    md = md.replace(re, (_, content) => "#".repeat(i) + " " + content.trim());
  }

  // Bold
  md = md.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  // Italic
  md = md.replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i>([\s\S]*?)<\/i>/gi, "*$1*");
  // Strikethrough
  md = md.replace(/<del>([\s\S]*?)<\/del>/gi, "~~$1~~");
  // Inline code
  md = md.replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`");
  // Links
  md = md.replace(/<a\s+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  // Images
  md = md.replace(/<img\s+src="([^"]*)"(?:\s+alt="([^"]*)")?[^>]*\/?>/gi, "![$2]($1)");
  // Paragraphs
  md = md.replace(/<p>([\s\S]*?)<\/p>/gi, "$1\n");
  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, "\n");
  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, "---");
  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, "");
  // Decode entities
  md = md.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

  return md.trim();
}
