export interface FaviconOptions {
  character: string;
  backgroundColor: string;
  textColor: string;
  fontSize?: number;
}

export function generateFaviconSvg(options: FaviconOptions): string {
  const { character, backgroundColor, textColor, fontSize = 32 } = options;
  const escaped = escapeXml(character);
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">',
    `  <rect width="48" height="48" rx="8" fill="${backgroundColor}" />`,
    `  <text x="24" y="24" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-family="Arial, sans-serif">${escaped}</text>`,
    "</svg>",
  ].join("\n");
}

export function generateLinkTags(svgDataUri?: string): string {
  const lines: string[] = [];
  lines.push(
    `<link rel="icon" type="image/svg+xml" href="${svgDataUri || "favicon.svg"}" />`
  );
  lines.push(
    `<link rel="alternate icon" href="favicon.ico" />`
  );
  return lines.join("\n");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
