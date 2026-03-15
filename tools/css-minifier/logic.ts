export function minifyCss(css: string): string {
  if (!css.trim()) return "";
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove newlines and extra whitespace
  result = result.replace(/\s+/g, " ");
  // Remove spaces around selectors and braces
  result = result.replace(/\s*{\s*/g, "{");
  result = result.replace(/\s*}\s*/g, "}");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*,\s*/g, ",");
  // Remove trailing semicolons before closing brace
  result = result.replace(/;}/g, "}");
  return result.trim();
}

export function formatCss(css: string, indentSize: number = 2): string {
  if (!css.trim()) return "";
  // First minify to normalize
  let minified = minifyCss(css);
  const indent = " ".repeat(indentSize);
  let result = "";
  let depth = 0;

  for (let i = 0; i < minified.length; i++) {
    const char = minified[i];

    if (char === "{") {
      result += " {\n";
      depth++;
      result += indent.repeat(depth);
    } else if (char === "}") {
      depth = Math.max(0, depth - 1);
      result += "\n" + indent.repeat(depth) + "}\n";
      if (depth === 0) result += "\n";
    } else if (char === ";") {
      result += ";\n";
      if (i + 1 < minified.length && minified[i + 1] !== "}") {
        result += indent.repeat(depth);
      }
    } else {
      result += char;
    }
  }

  return result.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export interface SizeStats {
  originalSize: number;
  resultSize: number;
  reduction: number;
  reductionPercent: number;
}

export function getSizeStats(original: string, result: string): SizeStats {
  const originalSize = new TextEncoder().encode(original).length;
  const resultSize = new TextEncoder().encode(result).length;
  const reduction = originalSize - resultSize;
  const reductionPercent =
    originalSize === 0 ? 0 : Math.round((reduction / originalSize) * 10000) / 100;
  return { originalSize, resultSize, reduction, reductionPercent };
}
