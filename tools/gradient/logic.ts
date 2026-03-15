export type GradientType = "linear" | "radial";

export interface GradientOptions {
  type: GradientType;
  angle: number;
  color1: string;
  color2: string;
  color3?: string;
}

export function generateGradientCSS(options: GradientOptions): string {
  const { type, angle, color1, color2, color3 } = options;
  const colors = color3 ? `${color1}, ${color2}, ${color3}` : `${color1}, ${color2}`;

  if (type === "radial") {
    return `radial-gradient(circle, ${colors})`;
  }
  return `linear-gradient(${angle}deg, ${colors})`;
}

export function generateFullCSS(options: GradientOptions): string {
  const gradient = generateGradientCSS(options);
  return `background: ${gradient};`;
}

export const directionPresets: { label: string; angle: number }[] = [
  { label: "→", angle: 90 },
  { label: "↓", angle: 180 },
  { label: "←", angle: 270 },
  { label: "↑", angle: 0 },
  { label: "↘", angle: 135 },
  { label: "↗", angle: 45 },
  { label: "↙", angle: 225 },
  { label: "↖", angle: 315 },
];
