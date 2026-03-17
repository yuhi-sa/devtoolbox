export type CssUnit = "px" | "rem" | "em" | "vw" | "vh";

export interface ConversionConfig {
  baseFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
  parentFontSize?: number;
}

const DEFAULT_CONFIG: ConversionConfig = {
  baseFontSize: 16,
  viewportWidth: 1920,
  viewportHeight: 1080,
};

export function convertCssUnit(
  value: number,
  from: CssUnit,
  to: CssUnit,
  config: Partial<ConversionConfig> = {}
): number {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const parentFont = cfg.parentFontSize ?? cfg.baseFontSize;

  const px = toPx(value, from, cfg, parentFont);
  return fromPx(px, to, cfg, parentFont);
}

function toPx(value: number, unit: CssUnit, cfg: ConversionConfig, parentFont: number): number {
  switch (unit) {
    case "px": return value;
    case "rem": return value * cfg.baseFontSize;
    case "em": return value * parentFont;
    case "vw": return (value * cfg.viewportWidth) / 100;
    case "vh": return (value * cfg.viewportHeight) / 100;
  }
}

function fromPx(px: number, unit: CssUnit, cfg: ConversionConfig, parentFont: number): number {
  switch (unit) {
    case "px": return px;
    case "rem": return px / cfg.baseFontSize;
    case "em": return px / parentFont;
    case "vw": return (px * 100) / cfg.viewportWidth;
    case "vh": return (px * 100) / cfg.viewportHeight;
  }
}

export function convertToAllUnits(
  value: number,
  from: CssUnit,
  config: Partial<ConversionConfig> = {}
): Record<CssUnit, number> {
  const units: CssUnit[] = ["px", "rem", "em", "vw", "vh"];
  const result = {} as Record<CssUnit, number>;
  for (const unit of units) {
    result[unit] = convertCssUnit(value, from, unit, config);
  }
  return result;
}
