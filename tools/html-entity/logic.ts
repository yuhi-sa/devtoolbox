const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const REVERSE_ENTITY_MAP: Record<string, string> = {};
for (const [char, entity] of Object.entries(ENTITY_MAP)) {
  REVERSE_ENTITY_MAP[entity] = char;
}

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] || ch);
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(
      /&(?:amp|lt|gt|quot|#39|#x27);/gi,
      (entity) => REVERSE_ENTITY_MAP[entity.toLowerCase()] || entity
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}
