export interface PlaceholderOptions {
  width: number;
  height: number;
  bgColor?: string;
  textColor?: string;
  text?: string;
  format?: "svg";
}

export function generatePlaceholderSvg(options: PlaceholderOptions): string {
  const {
    width,
    height,
    bgColor = "#CCCCCC",
    textColor = "#666666",
    text,
    format: _format = "svg",
  } = options;

  const displayText = text || `${width} x ${height}`;
  const fontSize = Math.max(12, Math.min(width, height) / 8);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `  <rect width="100%" height="100%" fill="${escapeXml(bgColor)}" />`,
    `  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"`,
    `    font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}"`,
    `    fill="${escapeXml(textColor)}">${escapeXml(displayText)}</text>`,
    `</svg>`,
  ].join("\n");
}

export function generateDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
