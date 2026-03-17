export function formatJs(input: string, indentSize: number = 2): string {
  if (!input.trim()) return "";
  const indent = " ".repeat(indentSize);
  const chars = input.trim();
  let result = "";
  let depth = 0;
  let inString: string | null = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = 0;

  const newline = () => "\n" + indent.repeat(depth);

  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1];

    // Handle escape in strings
    if (escaped) {
      result += ch;
      escaped = false;
      i++;
      continue;
    }

    if (ch === "\\" && inString) {
      result += ch;
      escaped = true;
      i++;
      continue;
    }

    // Handle line comments
    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        result += newline();
      } else {
        result += ch;
      }
      i++;
      continue;
    }

    // Handle block comments
    if (inBlockComment) {
      result += ch;
      if (ch === "*" && next === "/") {
        result += next;
        inBlockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    // Handle strings
    if (inString) {
      result += ch;
      if (ch === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    // Start string
    if (ch === '"' || ch === "'" || ch === "`") {
      result += ch;
      inString = ch;
      i++;
      continue;
    }

    // Start line comment
    if (ch === "/" && next === "/") {
      result += "//";
      inLineComment = true;
      i += 2;
      continue;
    }

    // Start block comment
    if (ch === "/" && next === "*") {
      result += "/*";
      inBlockComment = true;
      i += 2;
      continue;
    }

    // Opening braces/brackets
    if (ch === "{" || ch === "[" || ch === "(") {
      depth++;
      result += ch + newline();
      i++;
      continue;
    }

    // Closing braces/brackets
    if (ch === "}" || ch === "]" || ch === ")") {
      depth = Math.max(0, depth - 1);
      result += newline() + ch;
      i++;
      continue;
    }

    // Semicolons
    if (ch === ";") {
      result += ch + newline();
      i++;
      continue;
    }

    // Commas
    if (ch === ",") {
      result += ch + newline();
      i++;
      continue;
    }

    // Skip existing whitespace/newlines (we generate our own)
    if (ch === "\n" || ch === "\r") {
      i++;
      continue;
    }

    // Collapse multiple spaces
    if (ch === " " || ch === "\t") {
      if (result.length > 0 && result[result.length - 1] !== " " && result[result.length - 1] !== "\n") {
        result += " ";
      }
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  // Clean up: remove trailing whitespace on each line, remove blank lines
  return result
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, idx, arr) => {
      if (line === "" && idx > 0 && arr[idx - 1] === "") return false;
      return true;
    })
    .join("\n")
    .trim();
}

export function minifyJs(input: string): string {
  if (!input.trim()) return "";
  let result = "";
  let inString: string | null = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let lastNonSpace = "";

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\" && inString) {
      result += ch;
      escaped = true;
      continue;
    }

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      result += ch;
      if (ch === inString) inString = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      result += ch;
      inString = ch;
      lastNonSpace = ch;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }

    if (/\s/.test(ch)) {
      // Keep a single space if needed between identifiers/keywords
      if (result.length > 0 && /[a-zA-Z0-9_$]/.test(lastNonSpace) && i + 1 < input.length) {
        // Look ahead for next non-space
        let j = i + 1;
        while (j < input.length && /\s/.test(input[j])) j++;
        if (j < input.length && /[a-zA-Z0-9_$]/.test(input[j])) {
          result += " ";
        }
      }
      continue;
    }

    result += ch;
    lastNonSpace = ch;
  }

  return result.trim();
}

export function validateJs(input: string): { valid: boolean; error?: string } {
  try {
    // Basic bracket matching validation
    const stack: string[] = [];
    let inString: string | null = null;
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\" && inString) {
        escaped = true;
        continue;
      }

      if (inString) {
        if (ch === inString) inString = null;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === "`") {
        inString = ch;
        continue;
      }

      if (ch === "{" || ch === "[" || ch === "(") {
        stack.push(ch);
      } else if (ch === "}" || ch === "]" || ch === ")") {
        const open = stack.pop();
        const expected = ch === "}" ? "{" : ch === "]" ? "[" : "(";
        if (open !== expected) {
          return { valid: false, error: `Mismatched bracket: expected '${expected}' but found '${open || "nothing"}' at position ${i}` };
        }
      }
    }

    if (inString) {
      return { valid: false, error: "Unterminated string" };
    }

    if (stack.length > 0) {
      return { valid: false, error: `Unclosed bracket: '${stack[stack.length - 1]}'` };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
