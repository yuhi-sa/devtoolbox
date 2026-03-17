export type MimeType =
  | "text/plain"
  | "text/html"
  | "text/css"
  | "text/javascript"
  | "application/json"
  | "application/xml"
  | "image/svg+xml";

export const MIME_TYPES: { label: string; value: MimeType }[] = [
  { label: "Plain Text", value: "text/plain" },
  { label: "HTML", value: "text/html" },
  { label: "CSS", value: "text/css" },
  { label: "JavaScript", value: "text/javascript" },
  { label: "JSON", value: "application/json" },
  { label: "XML", value: "application/xml" },
  { label: "SVG", value: "image/svg+xml" },
];

export function textToDataUrl(
  text: string,
  mimeType: MimeType,
  useBase64: boolean = true
): string {
  if (!text) return "";

  if (useBase64) {
    const encoded = btoa(unescape(encodeURIComponent(text)));
    return `data:${mimeType};base64,${encoded}`;
  }

  const encoded = encodeURIComponent(text);
  return `data:${mimeType},${encoded}`;
}

export function getDataUrlSize(dataUrl: string): {
  bytes: number;
  formatted: string;
} {
  if (!dataUrl) return { bytes: 0, formatted: "0 B" };

  const bytes = new TextEncoder().encode(dataUrl).length;
  return { bytes, formatted: formatBytes(bytes) };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const idx = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value.toFixed(idx === 0 ? 0 : 2)} ${units[idx]}`;
}

export function isValidSvg(input: string): boolean {
  const trimmed = input.trim();
  return trimmed.startsWith("<svg") && trimmed.includes("</svg>");
}
