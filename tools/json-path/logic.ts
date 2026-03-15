export function queryJsonPath(
  json: string,
  path: string
): { result: string; error?: string } {
  try {
    const data = JSON.parse(json);
    const result = evaluatePath(data, path);
    return { result: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { result: "", error: (e as Error).message };
  }
}

function evaluatePath(data: unknown, path: string): unknown {
  if (path === "$" || path === "") return data;

  const normalized = path.startsWith("$") ? path.slice(1) : path;
  const tokens = tokenize(normalized);
  let current: unknown[] = [data];

  for (const token of tokens) {
    const next: unknown[] = [];
    for (const item of current) {
      if (token === "**" || token === "..") {
        collectDeep(item, next);
      } else if (token === "*") {
        if (Array.isArray(item)) {
          next.push(...item);
        } else if (item && typeof item === "object") {
          next.push(...Object.values(item as Record<string, unknown>));
        }
      } else if (token.startsWith("[") && token.endsWith("]")) {
        const inner = token.slice(1, -1);
        if (Array.isArray(item)) {
          const idx = parseInt(inner, 10);
          if (!isNaN(idx) && idx >= 0 && idx < item.length) {
            next.push(item[idx]);
          }
        } else if (item && typeof item === "object") {
          const key = inner.replace(/^['"]|['"]$/g, "");
          if (key in (item as Record<string, unknown>)) {
            next.push((item as Record<string, unknown>)[key]);
          }
        }
      } else {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const obj = item as Record<string, unknown>;
          if (token in obj) {
            next.push(obj[token]);
          }
        }
      }
    }
    current = next;
  }

  return current.length === 1 ? current[0] : current;
}

function tokenize(path: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < path.length) {
    if (path[i] === ".") {
      if (path[i + 1] === ".") {
        tokens.push("..");
        i += 2;
      } else {
        i++;
      }
    } else if (path[i] === "[") {
      const end = path.indexOf("]", i);
      if (end === -1) break;
      tokens.push(path.slice(i, end + 1));
      i = end + 1;
    } else {
      let end = i;
      while (end < path.length && path[end] !== "." && path[end] !== "[") {
        end++;
      }
      tokens.push(path.slice(i, end));
      i = end;
    }
  }
  return tokens;
}

function collectDeep(obj: unknown, result: unknown[]): void {
  if (obj === null || obj === undefined) return;
  result.push(obj);
  if (Array.isArray(obj)) {
    for (const item of obj) {
      collectDeep(item, result);
    }
  } else if (typeof obj === "object") {
    for (const val of Object.values(obj as Record<string, unknown>)) {
      collectDeep(val, result);
    }
  }
}
