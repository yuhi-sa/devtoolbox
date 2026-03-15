export interface SvgStats {
  size: number;
  elements: number;
  viewBox: string | null;
}

export function optimizeSvg(input: string): string {
  let result = input;
  // Remove XML comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  // Remove unnecessary whitespace between tags
  result = result.replace(/>\s+</g, "><");
  // Remove empty groups
  result = result.replace(/<g\s*>\s*<\/g>/g, "");
  // Trim leading/trailing whitespace
  result = result.trim();
  return result;
}

export function getSvgStats(input: string): SvgStats {
  const size = new TextEncoder().encode(input).length;
  const elementMatches = input.match(/<[a-zA-Z][^>]*?\/?>/g);
  const elements = elementMatches ? elementMatches.length : 0;
  const viewBoxMatch = input.match(/viewBox=["']([^"']*)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : null;
  return { size, elements, viewBox };
}
