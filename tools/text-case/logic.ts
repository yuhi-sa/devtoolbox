export interface CaseConversions {
  camelCase: string;
  pascalCase: string;
  snakeCase: string;
  screamingSnakeCase: string;
  kebabCase: string;
  titleCase: string;
  upperCase: string;
  lowerCase: string;
}

function splitWords(input: string): string[] {
  // Handle camelCase and PascalCase boundaries
  let normalized = input.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Handle SCREAMING followed by lowercase
  normalized = normalized.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  // Replace common separators with spaces
  normalized = normalized.replace(/[-_./\\]+/g, " ");
  // Split on whitespace and filter empty
  return normalized
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.toLowerCase());
}

export function toCamelCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return "";
  return words
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");
}

export function toPascalCase(input: string): string {
  const words = splitWords(input);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

export function toSnakeCase(input: string): string {
  return splitWords(input).join("_");
}

export function toScreamingSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join("_");
}

export function toKebabCase(input: string): string {
  return splitWords(input).join("-");
}

export function toTitleCase(input: string): string {
  return splitWords(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function toUpperCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join(" ");
}

export function toLowerCase(input: string): string {
  return splitWords(input).join(" ");
}

export function convertAllCases(input: string): CaseConversions {
  return {
    camelCase: toCamelCase(input),
    pascalCase: toPascalCase(input),
    snakeCase: toSnakeCase(input),
    screamingSnakeCase: toScreamingSnakeCase(input),
    kebabCase: toKebabCase(input),
    titleCase: toTitleCase(input),
    upperCase: toUpperCase(input),
    lowerCase: toLowerCase(input),
  };
}
