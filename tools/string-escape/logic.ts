// JSON escape/unescape
export function jsonEscape(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

export function jsonUnescape(input: string): string {
  return JSON.parse(`"${input}"`);
}

// HTML escape/unescape
const htmlEscapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const htmlUnescapeMap: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
};

export function htmlEscape(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => htmlEscapeMap[ch] || ch);
}

export function htmlUnescape(input: string): string {
  return input.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;|&#x2F;/g,
    (entity) => htmlUnescapeMap[entity] || entity
  );
}

// URL encode/decode
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

// Unicode escape/unescape
export function unicodeEscape(input: string): string {
  return Array.from(input)
    .map((ch) => {
      const code = ch.codePointAt(0)!;
      if (code > 127) {
        if (code > 0xffff) {
          return `\\u{${code.toString(16)}}`;
        }
        return `\\u${code.toString(16).padStart(4, "0")}`;
      }
      return ch;
    })
    .join("");
}

export function unicodeUnescape(input: string): string {
  return input
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

// Backslash escape/unescape
export function backslashEscape(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\0/g, "\\0");
}

export function backslashUnescape(input: string): string {
  let result = "";
  let i = 0;
  while (i < input.length) {
    if (input[i] === "\\" && i + 1 < input.length) {
      switch (input[i + 1]) {
        case "n":
          result += "\n";
          i += 2;
          break;
        case "r":
          result += "\r";
          i += 2;
          break;
        case "t":
          result += "\t";
          i += 2;
          break;
        case "0":
          result += "\0";
          i += 2;
          break;
        case "\\":
          result += "\\";
          i += 2;
          break;
        default:
          result += input[i + 1];
          i += 2;
          break;
      }
    } else {
      result += input[i];
      i++;
    }
  }
  return result;
}

export type EscapeMode = "json" | "html" | "url" | "unicode" | "backslash";

export function escape(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json":
      return jsonEscape(input);
    case "html":
      return htmlEscape(input);
    case "url":
      return urlEncode(input);
    case "unicode":
      return unicodeEscape(input);
    case "backslash":
      return backslashEscape(input);
  }
}

export function unescape(input: string, mode: EscapeMode): string {
  switch (mode) {
    case "json":
      return jsonUnescape(input);
    case "html":
      return htmlUnescape(input);
    case "url":
      return urlDecode(input);
    case "unicode":
      return unicodeUnescape(input);
    case "backslash":
      return backslashUnescape(input);
  }
}
