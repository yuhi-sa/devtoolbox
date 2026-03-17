export interface AspectRatioResult {
  ratio: string;
  decimal: number;
  width: number;
  height: number;
}

export const COMMON_RATIOS: { name: string; width: number; height: number }[] = [
  { name: "1:1 (Square)", width: 1, height: 1 },
  { name: "4:3 (Standard)", width: 4, height: 3 },
  { name: "3:2 (Photo)", width: 3, height: 2 },
  { name: "16:9 (Widescreen)", width: 16, height: 9 },
  { name: "16:10 (Laptop)", width: 16, height: 10 },
  { name: "21:9 (Ultrawide)", width: 21, height: 9 },
  { name: "9:16 (Portrait)", width: 9, height: 16 },
  { name: "2:3 (Portrait Photo)", width: 2, height: 3 },
  { name: "3:4 (Portrait Standard)", width: 3, height: 4 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function calculateAspectRatio(
  width: number,
  height: number
): AspectRatioResult {
  if (width <= 0 || height <= 0) {
    throw new Error("Width and height must be positive numbers");
  }

  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  return {
    ratio: `${ratioW}:${ratioH}`,
    decimal: width / height,
    width: ratioW,
    height: ratioH,
  };
}

export function resizeByWidth(
  ratioWidth: number,
  ratioHeight: number,
  targetWidth: number
): { width: number; height: number } {
  if (ratioWidth <= 0 || ratioHeight <= 0 || targetWidth <= 0) {
    throw new Error("All values must be positive");
  }
  return {
    width: targetWidth,
    height: Math.round((targetWidth * ratioHeight) / ratioWidth),
  };
}

export function resizeByHeight(
  ratioWidth: number,
  ratioHeight: number,
  targetHeight: number
): { width: number; height: number } {
  if (ratioWidth <= 0 || ratioHeight <= 0 || targetHeight <= 0) {
    throw new Error("All values must be positive");
  }
  return {
    width: Math.round((targetHeight * ratioWidth) / ratioHeight),
    height: targetHeight,
  };
}
