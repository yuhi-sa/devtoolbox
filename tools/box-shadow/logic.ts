export interface BoxShadowOptions {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export const defaultBoxShadow: BoxShadowOptions = {
  x: 4,
  y: 4,
  blur: 10,
  spread: 0,
  color: "#000000",
  opacity: 25,
  inset: false,
};

export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Math.round(opacity) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function generateBoxShadowCSS(options: BoxShadowOptions): string {
  const { x, y, blur, spread, color, opacity, inset } = options;
  const rgba = hexToRgba(color, opacity);
  const insetStr = inset ? "inset " : "";
  return `${insetStr}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
}

export function generateFullCSS(options: BoxShadowOptions): string {
  const shadow = generateBoxShadowCSS(options);
  return `box-shadow: ${shadow};`;
}

export function generateMultipleShadowsCSS(shadows: BoxShadowOptions[]): string {
  if (shadows.length === 0) return "";
  const parts = shadows.map((s) => generateBoxShadowCSS(s));
  return `box-shadow: ${parts.join(",\n             ")};`;
}
