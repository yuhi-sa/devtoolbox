export function tomlToJson(input: string): string {
  const result: Record<string, unknown> = {};
  let currentSection = result;
  const lines = input.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const keys = sectionMatch[1].split(".");
      let obj = result;
      for (const key of keys) {
        if (!(key in obj)) {
          obj[key] = {};
        }
        obj = obj[key] as Record<string, unknown>;
      }
      currentSection = obj;
      continue;
    }

    const kvMatch = line.match(/^(\w[\w.-]*)?\s*=\s*(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const rawValue = kvMatch[2].trim();
      currentSection[key] = parseTomlValue(rawValue);
      continue;
    }

    throw new Error(`Invalid TOML at line ${i + 1}: ${line}`);
  }

  return JSON.stringify(result, null, 2);
}

function parseTomlValue(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;

  if (/^"(.*)"$/.test(value)) {
    return value.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (/^'(.*)'$/.test(value)) {
    return value.slice(1, -1);
  }

  if (value.startsWith("[")) {
    return parseTomlArray(value);
  }

  if (/^[+-]?\d+\.\d+$/.test(value)) return parseFloat(value);
  if (/^[+-]?\d+$/.test(value)) return parseInt(value, 10);

  throw new Error(`Unsupported TOML value: ${value}`);
}

function parseTomlArray(value: string): unknown[] {
  if (value === "[]") return [];
  const inner = value.slice(1, -1).trim();
  const items: unknown[] = [];
  let depth = 0;
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (inString) {
      current += c;
      if (c === stringChar && inner[i - 1] !== "\\") {
        inString = false;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      stringChar = c;
      current += c;
      continue;
    }
    if (c === "[") { depth++; current += c; continue; }
    if (c === "]") { depth--; current += c; continue; }
    if (c === "," && depth === 0) {
      items.push(parseTomlValue(current.trim()));
      current = "";
      continue;
    }
    current += c;
  }
  if (current.trim()) {
    items.push(parseTomlValue(current.trim()));
  }
  return items;
}

export function jsonToToml(input: string): string {
  const obj = JSON.parse(input);
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("JSON root must be an object");
  }
  return generateToml(obj as Record<string, unknown>, "");
}

function generateToml(obj: Record<string, unknown>, prefix: string): string {
  const lines: string[] = [];
  const sections: [string, Record<string, unknown>][] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const sectionKey = prefix ? `${prefix}.${key}` : key;
      sections.push([sectionKey, value as Record<string, unknown>]);
    } else {
      lines.push(`${key} = ${toTomlValue(value)}`);
    }
  }

  for (const [sectionKey, sectionObj] of sections) {
    lines.push("");
    lines.push(`[${sectionKey}]`);
    lines.push(generateToml(sectionObj, sectionKey));
  }

  return lines.join("\n");
}

function toTomlValue(value: unknown): string {
  if (typeof value === "string") return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map(toTomlValue).join(", ")}]`;
  throw new Error(`Cannot convert value to TOML: ${typeof value}`);
}
