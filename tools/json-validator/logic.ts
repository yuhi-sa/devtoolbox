export interface ValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  stats?: {
    keyCount: number;
    depth: number;
    nodeCount: number;
  };
  keyPaths?: string[];
}

function getLineAndColumn(
  input: string,
  position: number
): { line: number; column: number } {
  const lines = input.substring(0, position).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function extractPosition(message: string): number | null {
  const match = message.match(/position\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function collectKeyPaths(
  value: unknown,
  prefix: string,
  paths: string[],
  depth: number,
  stats: { keyCount: number; maxDepth: number; nodeCount: number }
): void {
  stats.nodeCount++;
  if (depth > stats.maxDepth) stats.maxDepth = depth;

  if (value === null || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const path = `${prefix}[${index}]`;
      paths.push(path);
      collectKeyPaths(item, path, paths, depth + 1, stats);
    });
  } else {
    const obj = value as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      stats.keyCount++;
      const path = prefix ? `${prefix}.${key}` : key;
      paths.push(path);
      collectKeyPaths(obj[key], path, paths, depth + 1, stats);
    }
  }
}

export function validateJson(input: string): ValidationResult {
  if (input.trim().length === 0) {
    return {
      valid: false,
      error: { message: "Input is empty" },
    };
  }

  try {
    const parsed = JSON.parse(input);

    const paths: string[] = [];
    const stats = { keyCount: 0, maxDepth: 0, nodeCount: 0 };
    collectKeyPaths(parsed, "", paths, 0, stats);

    return {
      valid: true,
      stats: {
        keyCount: stats.keyCount,
        depth: stats.maxDepth,
        nodeCount: stats.nodeCount,
      },
      keyPaths: paths,
    };
  } catch (e) {
    const msg = (e as Error).message;
    const position = extractPosition(msg);

    let line: number | undefined;
    let column: number | undefined;

    if (position !== null) {
      const loc = getLineAndColumn(input, position);
      line = loc.line;
      column = loc.column;
    }

    return {
      valid: false,
      error: {
        message: msg,
        line,
        column,
      },
    };
  }
}

export function formatJson(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2);
}
