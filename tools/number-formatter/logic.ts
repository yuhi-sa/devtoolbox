export interface FormatOptions {
  thousandSeparator?: string;
  decimalPlaces?: number;
  currencySymbol?: string;
  currencyPosition?: "prefix" | "suffix";
  notation?: "standard" | "scientific" | "compact";
}

export function formatNumber(input: string, options: FormatOptions = {}): string {
  const num = parseFloat(input);
  if (isNaN(num)) {
    throw new Error("Invalid number");
  }

  const {
    thousandSeparator = ",",
    decimalPlaces,
    currencySymbol = "",
    currencyPosition = "prefix",
    notation = "standard",
  } = options;

  if (notation === "scientific") {
    const result = decimalPlaces !== undefined ? num.toExponential(decimalPlaces) : num.toExponential();
    return applyCurrency(result, currencySymbol, currencyPosition);
  }

  if (notation === "compact") {
    const absNum = Math.abs(num);
    let suffix = "";
    let divisor = 1;
    if (absNum >= 1e12) { suffix = "T"; divisor = 1e12; }
    else if (absNum >= 1e9) { suffix = "B"; divisor = 1e9; }
    else if (absNum >= 1e6) { suffix = "M"; divisor = 1e6; }
    else if (absNum >= 1e3) { suffix = "K"; divisor = 1e3; }
    const compactNum = num / divisor;
    const dp = decimalPlaces !== undefined ? decimalPlaces : 1;
    const result = compactNum.toFixed(dp) + suffix;
    return applyCurrency(result, currencySymbol, currencyPosition);
  }

  const dp = decimalPlaces !== undefined ? decimalPlaces : undefined;
  const fixed = dp !== undefined ? num.toFixed(dp) : String(num);

  const [intPart, decPart] = fixed.split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const absInt = intPart.replace("-", "");

  let formatted = "";
  for (let i = absInt.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formatted = thousandSeparator + formatted;
    }
    formatted = absInt[i] + formatted;
  }
  formatted = sign + formatted;

  if (decPart !== undefined) {
    formatted += "." + decPart;
  }

  return applyCurrency(formatted, currencySymbol, currencyPosition);
}

function applyCurrency(value: string, symbol: string, position: "prefix" | "suffix"): string {
  if (!symbol) return value;
  return position === "prefix" ? symbol + value : value + symbol;
}

export function parseFormattedNumber(input: string): number {
  const cleaned = input.replace(/[^0-9.\-eE+]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num)) throw new Error("Cannot parse number");
  return num;
}
