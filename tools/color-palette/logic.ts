export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface PaletteColor {
  hex: string;
  rgb: RgbColor;
  label: string;
}

export function hexToRgb(hex: string): RgbColor {
  const clean = hex.replace(/^#/, "");
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RgbColor): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToRgb(hsl: HslColor): RgbColor {
  const { h, s, l } = hsl;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hNorm = h / 360;
  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

export function hexToHsl(hex: string): HslColor {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HslColor): string {
  return rgbToHex(hslToRgb(hsl));
}

function makeColor(hsl: HslColor, label: string): PaletteColor {
  const normalizedH = ((hsl.h % 360) + 360) % 360;
  const clampedS = Math.max(0, Math.min(1, hsl.s));
  const clampedL = Math.max(0, Math.min(1, hsl.l));
  const normalized = { h: normalizedH, s: clampedS, l: clampedL };
  const rgb = hslToRgb(normalized);
  return { hex: rgbToHex(rgb), rgb, label };
}

export function generatePalette(hex: string): PaletteColor[] {
  const hsl = hexToHsl(hex);
  const colors: PaletteColor[] = [];

  // Base
  colors.push(makeColor(hsl, "Base"));

  // Complementary
  colors.push(makeColor({ ...hsl, h: hsl.h + 180 }, "Complementary"));

  // Analogous
  colors.push(makeColor({ ...hsl, h: hsl.h - 30 }, "Analogous 1"));
  colors.push(makeColor({ ...hsl, h: hsl.h + 30 }, "Analogous 2"));

  // Triadic
  colors.push(makeColor({ ...hsl, h: hsl.h + 120 }, "Triadic 1"));
  colors.push(makeColor({ ...hsl, h: hsl.h + 240 }, "Triadic 2"));

  // Split-complementary
  colors.push(makeColor({ ...hsl, h: hsl.h + 150 }, "Split-comp 1"));
  colors.push(makeColor({ ...hsl, h: hsl.h + 210 }, "Split-comp 2"));

  // Monochromatic
  colors.push(makeColor({ ...hsl, l: Math.min(1, hsl.l + 0.2) }, "Lighter"));
  colors.push(makeColor({ ...hsl, l: Math.max(0, hsl.l - 0.2) }, "Darker"));

  return colors;
}
