export interface JsonSizeAnalysis {
  totalSize: number;
  minifiedSize: number;
  formattedSize: number;
  keyCount: number;
  maxDepth: number;
  dataTypes: Record<string, number>;
  arrayCount: number;
  objectCount: number;
}

function analyzeValue(
  value: unknown,
  depth: number,
  result: { keyCount: number; maxDepth: number; dataTypes: Record<string, number>; arrayCount: number; objectCount: number }
): void {
  if (depth > result.maxDepth) {
    result.maxDepth = depth;
  }

  if (value === null) {
    result.dataTypes["null"] = (result.dataTypes["null"] || 0) + 1;
    return;
  }

  if (Array.isArray(value)) {
    result.dataTypes["array"] = (result.dataTypes["array"] || 0) + 1;
    result.arrayCount++;
    for (const item of value) {
      analyzeValue(item, depth + 1, result);
    }
    return;
  }

  const type = typeof value;

  if (type === "object") {
    result.dataTypes["object"] = (result.dataTypes["object"] || 0) + 1;
    result.objectCount++;
    const keys = Object.keys(value as Record<string, unknown>);
    result.keyCount += keys.length;
    for (const key of keys) {
      analyzeValue((value as Record<string, unknown>)[key], depth + 1, result);
    }
    return;
  }

  result.dataTypes[type] = (result.dataTypes[type] || 0) + 1;
}

export function analyzeJsonSize(input: string): JsonSizeAnalysis {
  const parsed = JSON.parse(input);

  const minified = JSON.stringify(parsed);
  const formatted = JSON.stringify(parsed, null, 2);

  const result = {
    keyCount: 0,
    maxDepth: 0,
    dataTypes: {} as Record<string, number>,
    arrayCount: 0,
    objectCount: 0,
  };

  analyzeValue(parsed, 0, result);

  return {
    totalSize: new TextEncoder().encode(input).length,
    minifiedSize: new TextEncoder().encode(minified).length,
    formattedSize: new TextEncoder().encode(formatted).length,
    keyCount: result.keyCount,
    maxDepth: result.maxDepth,
    dataTypes: result.dataTypes,
    arrayCount: result.arrayCount,
    objectCount: result.objectCount,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}
