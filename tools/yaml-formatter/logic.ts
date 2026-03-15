// Simple YAML parser/formatter supporting: key-value, nested objects, arrays, strings, numbers, booleans

export type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue };

export function parseYaml(input: string): YamlValue {
  const lines = input.split("\n");
  const result = parseLines(lines, 0, 0);
  return result.value;
}

interface ParseResult {
  value: YamlValue;
  consumed: number;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseScalar(raw: string): YamlValue {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "null" || trimmed === "~") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  // Remove surrounding quotes if present
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseLines(
  lines: string[],
  startIndex: number,
  expectedIndent: number
): ParseResult {
  const obj: { [key: string]: YamlValue } = {};
  let i = startIndex;
  let isArray = false;
  const arr: YamlValue[] = [];

  while (i < lines.length) {
    const line = lines[i];
    // Skip empty lines and comments
    if (line.trim() === "" || line.trim().startsWith("#")) {
      i++;
      continue;
    }

    const indent = getIndent(line);
    if (indent < expectedIndent) break;
    if (indent > expectedIndent) break;

    const content = line.trim();

    // Array item
    if (content.startsWith("- ")) {
      isArray = true;
      const rest = content.slice(2);
      // Check if it's a key-value inside array item
      const kvMatch = rest.match(/^([^:]+):\s*(.*)/);
      if (kvMatch && kvMatch[2] === "") {
        // Nested object inside array
        const nested = parseLines(lines, i + 1, indent + 2);
        const innerObj: { [key: string]: YamlValue } = {};
        innerObj[kvMatch[1].trim()] = nested.value;
        arr.push(innerObj);
        i = i + 1 + nested.consumed;
      } else if (kvMatch && kvMatch[2] !== "") {
        const innerObj: { [key: string]: YamlValue } = {};
        innerObj[kvMatch[1].trim()] = parseScalar(kvMatch[2]);
        arr.push(innerObj);
        i++;
      } else {
        arr.push(parseScalar(rest));
        i++;
      }
      continue;
    }

    // Key-value
    const kvMatch = content.match(/^([^:]+):\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const valPart = kvMatch[2].trim();
      if (valPart === "") {
        // Nested structure
        const nextNonEmpty = findNextNonEmptyLine(lines, i + 1);
        if (nextNonEmpty < lines.length) {
          const nextIndent = getIndent(lines[nextNonEmpty]);
          if (nextIndent > indent) {
            const nested = parseLines(lines, nextNonEmpty, nextIndent);
            obj[key] = nested.value;
            i = nextNonEmpty + nested.consumed;
            continue;
          }
        }
        obj[key] = null;
        i++;
      } else {
        obj[key] = parseScalar(valPart);
        i++;
      }
      continue;
    }

    // Standalone scalar (top-level)
    return { value: parseScalar(content), consumed: 1 };
  }

  const consumed = i - startIndex;
  if (isArray) return { value: arr, consumed };
  return { value: obj, consumed };
}

function findNextNonEmptyLine(lines: string[], start: number): number {
  for (let i = start; i < lines.length; i++) {
    if (lines[i].trim() !== "" && !lines[i].trim().startsWith("#")) return i;
  }
  return lines.length;
}

export function stringifyYaml(value: YamlValue, indent: number = 0): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") {
    if (value.includes(":") || value.includes("#") || value.includes('"')) {
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return value;
  }

  const prefix = "  ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        const serialized = stringifyYaml(item, indent + 1);
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          // Object inside array: inline first key, indent rest
          const lines = serialized.split("\n");
          const first = lines[0];
          const rest = lines.slice(1).map((l) => prefix + "  " + l);
          return `${prefix}- ${first}${rest.length > 0 ? "\n" + rest.join("\n") : ""}`;
        }
        return `${prefix}- ${serialized}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        if (
          typeof v === "object" &&
          v !== null &&
          (Array.isArray(v)
            ? v.length > 0
            : Object.keys(v).length > 0)
        ) {
          return `${prefix}${k}:\n${stringifyYaml(v, indent + 1)}`;
        }
        return `${prefix}${k}: ${stringifyYaml(v, indent + 1)}`;
      })
      .join("\n");
  }

  return String(value);
}

export function formatYaml(input: string, indentSize: number = 2): string {
  const parsed = parseYaml(input);
  return stringifyYaml(parsed);
}

export function validateYaml(
  input: string
): { valid: boolean; error?: string } {
  try {
    parseYaml(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export function yamlToJson(input: string, indent: number = 2): string {
  const parsed = parseYaml(input);
  return JSON.stringify(parsed, null, indent);
}

export function jsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return stringifyYaml(parsed);
}
