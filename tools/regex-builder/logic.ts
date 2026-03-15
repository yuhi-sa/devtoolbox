export interface RegexPart {
  type: string;
  quantifier?: "" | "?" | "+" | "*";
  value?: string;
}

export interface RegexFlags {
  caseInsensitive?: boolean;
  global?: boolean;
  multiline?: boolean;
}

const PATTERN_MAP: Record<string, string> = {
  digit: "\\d",
  digits: "\\d+",
  letter: "[a-zA-Z]",
  letters: "[a-zA-Z]+",
  alphanumeric: "[a-zA-Z0-9]",
  whitespace: "\\s",
  word: "\\w+",
  any: ".",
  email: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
  url: "https?://[a-zA-Z0-9.-]+(?:/[^\\s]*)?",
  phone: "\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}",
  date: "\\d{4}[-/]\\d{2}[-/]\\d{2}",
  startOfLine: "^",
  endOfLine: "$",
  custom: "",
};

const DESCRIPTION_MAP: Record<string, string> = {
  digit: "a digit (0-9)",
  digits: "one or more digits",
  letter: "a letter (a-z, A-Z)",
  letters: "one or more letters",
  alphanumeric: "an alphanumeric character",
  whitespace: "a whitespace character",
  word: "a word (one or more word characters)",
  any: "any character",
  email: "an email address",
  url: "a URL",
  phone: "a phone number",
  date: "a date (YYYY-MM-DD or YYYY/MM/DD)",
  startOfLine: "start of line",
  endOfLine: "end of line",
  custom: "custom pattern",
};

export function buildRegex(parts: RegexPart[], flags?: RegexFlags): string {
  const pattern = parts
    .map((part) => {
      let base =
        part.type === "custom" ? part.value || "" : PATTERN_MAP[part.type] || "";
      if (part.quantifier) {
        base += part.quantifier;
      }
      return base;
    })
    .join("");

  let flagStr = "";
  if (flags?.global) flagStr += "g";
  if (flags?.caseInsensitive) flagStr += "i";
  if (flags?.multiline) flagStr += "m";

  return flagStr ? `/${pattern}/${flagStr}` : `/${pattern}/`;
}

export function describeRegex(parts: RegexPart[]): string {
  if (parts.length === 0) return "Empty pattern";

  const descriptions = parts.map((part) => {
    const base =
      part.type === "custom"
        ? `custom pattern "${part.value || ""}"`
        : DESCRIPTION_MAP[part.type] || part.type;

    const quantifierDesc =
      part.quantifier === "?"
        ? " (optional)"
        : part.quantifier === "+"
          ? " (one or more)"
          : part.quantifier === "*"
            ? " (zero or more)"
            : "";

    return base + quantifierDesc;
  });

  return "Matches: " + descriptions.join(", then ");
}

export function getAvailablePatterns(): Array<{ type: string; label: string }> {
  return [
    { type: "digit", label: "Digit (0-9)" },
    { type: "digits", label: "Digits (0-9+)" },
    { type: "letter", label: "Letter (a-zA-Z)" },
    { type: "letters", label: "Letters (a-zA-Z+)" },
    { type: "alphanumeric", label: "Alphanumeric" },
    { type: "whitespace", label: "Whitespace" },
    { type: "word", label: "Word" },
    { type: "any", label: "Any character" },
    { type: "email", label: "Email" },
    { type: "url", label: "URL" },
    { type: "phone", label: "Phone number" },
    { type: "date", label: "Date (YYYY-MM-DD)" },
    { type: "startOfLine", label: "Start of line (^)" },
    { type: "endOfLine", label: "End of line ($)" },
    { type: "custom", label: "Custom" },
  ];
}
