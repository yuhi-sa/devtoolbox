export interface PythonGenOptions {
  rootName?: string;
}

export function jsonToPython(
  input: string,
  options: PythonGenOptions = {}
): string {
  const { rootName = "Root" } = options;
  const parsed = JSON.parse(input);
  const dataclasses: string[] = [];
  const generated = new Set<string>();

  function toPascalCase(s: string): string {
    return s
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
  }

  function toSnakeCase(s: string): string {
    return s
      .replace(/([A-Z])/g, "_$1")
      .replace(/[-\s]+/g, "_")
      .replace(/^_/, "")
      .toLowerCase();
  }

  function inferType(value: unknown, key: string): string {
    if (value === null) return "Optional[Any]";
    if (value === undefined) return "Any";

    switch (typeof value) {
      case "string":
        return "str";
      case "number":
        return Number.isInteger(value) ? "int" : "float";
      case "boolean":
        return "bool";
      default:
        break;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return "list[Any]";
      const first = value[0];
      if (typeof first === "object" && first !== null && !Array.isArray(first)) {
        const className = toPascalCase(key);
        const merged = mergeObjects(value as Record<string, unknown>[]);
        generateDataclass(merged, className);
        return `list[${className}]`;
      }
      const itemType = inferType(first, key);
      return `list[${itemType}]`;
    }

    if (typeof value === "object" && value !== null) {
      const className = toPascalCase(key);
      generateDataclass(value as Record<string, unknown>, className);
      return className;
    }

    return "Any";
  }

  function generateDataclass(
    obj: Record<string, unknown>,
    name: string
  ): void {
    if (generated.has(name)) return;
    generated.add(name);

    const lines: string[] = [];
    lines.push("@dataclass");
    lines.push(`class ${name}:`);

    const entries = Object.entries(obj);
    if (entries.length === 0) {
      lines.push("    pass");
    } else {
      for (const [key, value] of entries) {
        const fieldName = toSnakeCase(key);
        const fieldType = inferType(value, key);
        lines.push(`    ${fieldName}: ${fieldType}`);
      }
    }

    dataclasses.push(lines.join("\n"));
  }

  // Header
  const imports = new Set<string>();
  imports.add("from dataclasses import dataclass");

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      imports.add("from typing import Any");
      return [...imports].join("\n") + `\n\n\ntype ${rootName} = list[Any]`;
    }
    const first = parsed[0];
    if (typeof first === "object" && first !== null) {
      const merged = mergeObjects(parsed as Record<string, unknown>[]);
      generateDataclass(merged, rootName);
    } else {
      const itemType = inferType(first, rootName);
      return [...imports].join("\n") + `\n\n\ntype ${rootName} = list[${itemType}]`;
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    generateDataclass(parsed as Record<string, unknown>, rootName);
  } else {
    const pyType = inferType(parsed, rootName);
    return [...imports].join("\n") + `\n\n\n${rootName} = ${pyType}`;
  }

  // Check if we need Optional or Any
  const allCode = dataclasses.join("\n\n");
  const typingImports: string[] = [];
  if (allCode.includes("Optional[")) typingImports.push("Optional");
  if (allCode.includes("Any")) typingImports.push("Any");
  if (typingImports.length > 0) {
    imports.add(`from typing import ${typingImports.join(", ")}`);
  }

  return [...imports].join("\n") + "\n\n\n" + dataclasses.reverse().join("\n\n\n");
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
