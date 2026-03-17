export interface BorderRadiusOptions {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  unit: "px" | "%" | "rem";
  linked: boolean;
}

export const defaultBorderRadius: BorderRadiusOptions = {
  topLeft: 8,
  topRight: 8,
  bottomRight: 8,
  bottomLeft: 8,
  unit: "px",
  linked: true,
};

export function generateBorderRadiusCSS(options: BorderRadiusOptions): string {
  const { topLeft, topRight, bottomRight, bottomLeft, unit } = options;

  // All equal
  if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
    return `border-radius: ${topLeft}${unit};`;
  }

  // Top-left/bottom-right and top-right/bottom-left pairs
  if (topLeft === bottomRight && topRight === bottomLeft) {
    return `border-radius: ${topLeft}${unit} ${topRight}${unit};`;
  }

  // Top-left, top-right/bottom-left, bottom-right
  if (topRight === bottomLeft) {
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit};`;
  }

  return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
}

export function generateIndividualCSS(options: BorderRadiusOptions): string {
  const { topLeft, topRight, bottomRight, bottomLeft, unit } = options;
  return [
    `border-top-left-radius: ${topLeft}${unit};`,
    `border-top-right-radius: ${topRight}${unit};`,
    `border-bottom-right-radius: ${bottomRight}${unit};`,
    `border-bottom-left-radius: ${bottomLeft}${unit};`,
  ].join("\n");
}

export function getBorderRadiusValue(options: BorderRadiusOptions): string {
  const { topLeft, topRight, bottomRight, bottomLeft, unit } = options;
  return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
}
