export type Base = 2 | 8 | 10 | 16;

export interface ConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
}

export function convertBase(value: string, fromBase: Base): ConversionResult {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Please enter a value.");
  }

  // Validate input for the given base
  const validChars: Record<Base, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  };

  if (!validChars[fromBase].test(trimmed)) {
    throw new Error(`Invalid character for base ${fromBase}.`);
  }

  const decimal = parseInt(trimmed, fromBase);

  if (isNaN(decimal)) {
    throw new Error("Failed to parse the input value.");
  }

  return {
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    decimal: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
  };
}

export function getBaseLabel(base: Base): string {
  const labels: Record<Base, string> = {
    2: "Binary (2)",
    8: "Octal (8)",
    10: "Decimal (10)",
    16: "Hexadecimal (16)",
  };
  return labels[base];
}
