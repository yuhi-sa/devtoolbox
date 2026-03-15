export type ByteUnit = "B" | "KB" | "MB" | "GB" | "TB" | "PB";

export const UNITS: ByteUnit[] = ["B", "KB", "MB", "GB", "TB", "PB"];

const BINARY_BASE = 1024;
const SI_BASE = 1000;

export interface ConversionResult {
  unit: ByteUnit;
  binary: string;
  si: string;
}

function getExponent(unit: ByteUnit): number {
  return UNITS.indexOf(unit);
}

export function convertBytes(
  value: number,
  fromUnit: ByteUnit
): ConversionResult[] {
  if (isNaN(value) || value < 0) {
    throw new Error("Value must be a non-negative number.");
  }

  const bytesFromBinary = value * Math.pow(BINARY_BASE, getExponent(fromUnit));
  const bytesFromSI = value * Math.pow(SI_BASE, getExponent(fromUnit));

  return UNITS.map((unit) => {
    const exp = getExponent(unit);
    const binaryValue = bytesFromBinary / Math.pow(BINARY_BASE, exp);
    const siValue = bytesFromSI / Math.pow(SI_BASE, exp);

    return {
      unit,
      binary: formatNumber(binaryValue),
      si: formatNumber(siValue),
    };
  });
}

function formatNumber(n: number): string {
  if (n === 0) return "0";
  if (Number.isInteger(n) && n < 1e15) return n.toString();
  if (n < 0.001) return n.toExponential(4);
  return parseFloat(n.toPrecision(10)).toString();
}
