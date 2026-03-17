export interface GoGenOptions {
  rootName?: string;
  inlineStructs?: boolean;
}

export function jsonToGo(input: string, options: GoGenOptions = {}): string {
  const { rootName = "Root", inlineStructs = false } = options;
  const parsed = JSON.parse(input);
  const structs: string[] = [];
  const generated = new Set<string>();

  function toPascalCase(s: string): string {
    return s
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
  }

  function toGoFieldName(key: string): string {
    const pascal = toPascalCase(key);
    // Common acronyms
    const acronyms = ["Id", "Url", "Api", "Http", "Https", "Json", "Xml", "Sql", "Ssh", "Tcp", "Udp", "Ip"];
    let result = pascal;
    for (const acr of acronyms) {
      if (result.endsWith(acr)) {
        result = result.slice(0, -acr.length) + acr.toUpperCase();
      }
      if (result === acr) {
        result = acr.toUpperCase();
      }
    }
    return result;
  }

  function inferType(value: unknown, key: string): string {
    if (value === null) return "interface{}";
    if (value === undefined) return "interface{}";

    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return Number.isInteger(value) ? "int64" : "float64";
      case "boolean":
        return "bool";
      default:
        break;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return "[]interface{}";
      const first = value[0];
      if (typeof first === "object" && first !== null && !Array.isArray(first)) {
        const structName = toPascalCase(key);
        if (!inlineStructs) {
          const merged = mergeObjects(value as Record<string, unknown>[]);
          generateStruct(merged, structName);
          return `[]${structName}`;
        }
        return `[]${inferType(first, key)}`;
      }
      return `[]${inferType(first, key)}`;
    }

    if (typeof value === "object" && value !== null) {
      const structName = toPascalCase(key);
      if (!inlineStructs) {
        generateStruct(value as Record<string, unknown>, structName);
        return structName;
      }
      // inline struct
      return generateInlineStruct(value as Record<string, unknown>);
    }

    return "interface{}";
  }

  function generateInlineStruct(obj: Record<string, unknown>): string {
    const lines: string[] = ["struct {"];
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toGoFieldName(key);
      const fieldType = inferType(value, key);
      const jsonTag = `\`json:"${key}"\``;
      lines.push(`\t${fieldName} ${fieldType} ${jsonTag}`);
    }
    lines.push("}");
    return lines.join("\n");
  }

  function generateStruct(
    obj: Record<string, unknown>,
    name: string
  ): void {
    if (generated.has(name)) return;
    generated.add(name);

    const lines: string[] = [];
    lines.push(`type ${name} struct {`);

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toGoFieldName(key);
      const fieldType = inferType(value, key);
      const jsonTag = `\`json:"${key}"\``;
      lines.push(`\t${fieldName} ${fieldType} ${jsonTag}`);
    }

    lines.push("}");
    structs.push(lines.join("\n"));
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `type ${rootName} = []interface{}`;
    }
    const first = parsed[0];
    if (typeof first === "object" && first !== null) {
      const merged = mergeObjects(parsed as Record<string, unknown>[]);
      generateStruct(merged, rootName);
      return structs.reverse().join("\n\n");
    }
    const itemType = inferType(first, rootName);
    return `type ${rootName} = []${itemType}`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    generateStruct(parsed as Record<string, unknown>, rootName);
    return structs.reverse().join("\n\n");
  }

  return `type ${rootName} = ${inferType(parsed, rootName)}`;
}

function mergeObjects(
  items: Record<string, unknown>[]
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const item of items) {
    if (typeof item === "object" && item !== null) {
      for (const [key, value] of Object.entries(item)) {
        if (!(key in merged)) {
          merged[key] = value;
        }
      }
    }
  }
  return merged;
}

export function validateJsonInput(
  input: string
): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
