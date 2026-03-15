import { escapeHtml } from "@/lib/escapeHtml";

export function parseMarkdown(input: string): string {
  let html = input;

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_m, code) => {
    return `<code>${escapeHtml(code)}</code>`;
  });

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );

  // Unordered lists
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Blockquote
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Line breaks -> paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p><(h[1-6]|ul|ol|pre|blockquote|hr)/g, "<$1");
  html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)><\/p>/g, "</$1>");
  html = html.replace(/<hr \/><\/p>/g, "<hr />");

  return html;
}
