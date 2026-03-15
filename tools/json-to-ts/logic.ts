export interface GeneratorOptions {
  rootName?: string;
  useInterface?: boolean;
}

export function jsonToTs(
  input: string,
  options: GeneratorOptions = {}
): string {
  const { rootName = "Root", useInterface = true } = options;
  const parsed = JSON.parse(input);
  const interfaces: string[] = [];
  const generated = new Set<string>();

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function getTypeName(key: string): string {
    // Convert key to PascalCase for type name
    return key
      .split(/[-_\s]+/)
      .map(capitalize)
      .join("");
  }

  function inferType(value: unknown, name: string): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      default:
        break;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return "unknown[]";
      const types = new Set(value.map((item) => inferType(item, name)));
      if (types.size === 1) {
        const singleType = [...types][0];
        return `${singleType}[]`;
      }
      return `(${[...types].join(" | ")})[]`;
    }

    if (typeof value === "object" && value !== null) {
      const typeName = getTypeName(name);
      if (!generated.has(typeName)) {
        generateInterface(value as Record<string, unknown>, typeName);
      }
      return typeName;
    }

    return "unknown";
  }

  function generateInterface(
    obj: Record<string, unknown>,
    name: string
  ): void {
    if (generated.has(name)) return;
    generated.add(name);

    const keyword = useInterface ? "interface" : "type";
    const equals = useInterface ? "" : " =";
    const lines: string[] = [];

    lines.push(`export ${keyword} ${name}${equals} {`);

    for (const [key, value] of Object.entries(obj)) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : `"${key}"`;
      const type = inferType(value, key);
      lines.push(`  ${safeKey}: ${type};`);
    }

    lines.push("}");
    interfaces.push(lines.join("\n"));
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `export type ${rootName} = unknown[];`;
    }
    const firstItem = parsed[0];
    if (typeof firstItem === "object" && firstItem !== null) {
      // Merge all array items to capture all possible keys
      const merged = mergeObjects(parsed as Record<string, unknown>[]);
      generateInterface(merged, rootName);
      return interfaces.reverse().join("\n\n");
    }
    const itemType = inferType(firstItem, rootName);
    return `export type ${rootName} = ${itemType}[];`;
  }

  if (typeof parsed === "object" && parsed !== null) {
    generateInterface(parsed as Record<string, unknown>, rootName);
    return interfaces.reverse().join("\n\n");
  }

  return `export type ${rootName} = ${inferType(parsed, rootName)};`;
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
