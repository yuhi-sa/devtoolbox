export interface CharacterInfo {
  character: string;
  codePoint: string;
  utf8Hex: string;
  htmlEntity: string;
  name: string;
}

const KNOWN_CHARACTERS: Record<number, string> = {
  0x0021: "EXCLAMATION MARK",
  0x0022: "QUOTATION MARK",
  0x0023: "NUMBER SIGN",
  0x0024: "DOLLAR SIGN",
  0x0025: "PERCENT SIGN",
  0x0026: "AMPERSAND",
  0x0027: "APOSTROPHE",
  0x0028: "LEFT PARENTHESIS",
  0x0029: "RIGHT PARENTHESIS",
  0x002a: "ASTERISK",
  0x002b: "PLUS SIGN",
  0x002c: "COMMA",
  0x002d: "HYPHEN-MINUS",
  0x002e: "FULL STOP",
  0x002f: "SOLIDUS",
  0x003a: "COLON",
  0x003b: "SEMICOLON",
  0x003c: "LESS-THAN SIGN",
  0x003d: "EQUALS SIGN",
  0x003e: "GREATER-THAN SIGN",
  0x003f: "QUESTION MARK",
  0x0040: "COMMERCIAL AT",
  0x005b: "LEFT SQUARE BRACKET",
  0x005c: "REVERSE SOLIDUS",
  0x005d: "RIGHT SQUARE BRACKET",
  0x005e: "CIRCUMFLEX ACCENT",
  0x005f: "LOW LINE",
  0x0060: "GRAVE ACCENT",
  0x007b: "LEFT CURLY BRACKET",
  0x007c: "VERTICAL LINE",
  0x007d: "RIGHT CURLY BRACKET",
  0x007e: "TILDE",
  0x00a9: "COPYRIGHT SIGN",
  0x00ae: "REGISTERED SIGN",
  0x00b0: "DEGREE SIGN",
  0x00b1: "PLUS-MINUS SIGN",
  0x00d7: "MULTIPLICATION SIGN",
  0x00f7: "DIVISION SIGN",
  0x2190: "LEFTWARDS ARROW",
  0x2191: "UPWARDS ARROW",
  0x2192: "RIGHTWARDS ARROW",
  0x2193: "DOWNWARDS ARROW",
  0x2194: "LEFT RIGHT ARROW",
  0x2500: "BOX DRAWINGS LIGHT HORIZONTAL",
  0x2502: "BOX DRAWINGS LIGHT VERTICAL",
  0x250c: "BOX DRAWINGS LIGHT DOWN AND RIGHT",
  0x2510: "BOX DRAWINGS LIGHT DOWN AND LEFT",
  0x2514: "BOX DRAWINGS LIGHT UP AND RIGHT",
  0x2518: "BOX DRAWINGS LIGHT UP AND LEFT",
  0x2551: "BOX DRAWINGS DOUBLE VERTICAL",
  0x2588: "FULL BLOCK",
  0x25a0: "BLACK SQUARE",
  0x25cf: "BLACK CIRCLE",
  0x2605: "BLACK STAR",
  0x2713: "CHECK MARK",
  0x2714: "HEAVY CHECK MARK",
  0x2717: "BALLOT X",
  0x2764: "HEAVY BLACK HEART",
  0x221a: "SQUARE ROOT",
  0x221e: "INFINITY",
  0x2248: "ALMOST EQUAL TO",
  0x2260: "NOT EQUAL TO",
  0x2264: "LESS-THAN OR EQUAL TO",
  0x2265: "GREATER-THAN OR EQUAL TO",
  0x03b1: "GREEK SMALL LETTER ALPHA",
  0x03b2: "GREEK SMALL LETTER BETA",
  0x03c0: "GREEK SMALL LETTER PI",
  0x2603: "SNOWMAN",
  0x2665: "BLACK HEART SUIT",
  0x266b: "BEAMED EIGHTH NOTES",
};

function getCharName(codePoint: number): string {
  if (KNOWN_CHARACTERS[codePoint]) return KNOWN_CHARACTERS[codePoint];
  if (codePoint >= 0x0030 && codePoint <= 0x0039)
    return `DIGIT ${String.fromCodePoint(codePoint)}`;
  if (codePoint >= 0x0041 && codePoint <= 0x005a)
    return `LATIN CAPITAL LETTER ${String.fromCodePoint(codePoint)}`;
  if (codePoint >= 0x0061 && codePoint <= 0x007a)
    return `LATIN SMALL LETTER ${String.fromCodePoint(codePoint)}`;
  if (codePoint >= 0x4e00 && codePoint <= 0x9fff) return "CJK UNIFIED IDEOGRAPH";
  if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) return "EMOTICON";
  if (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) return "MISCELLANEOUS SYMBOL";
  if (codePoint === 0x0020) return "SPACE";
  return "UNKNOWN CHARACTER";
}

export function getCodePoint(char: string): string {
  const cp = char.codePointAt(0);
  if (cp === undefined) return "";
  return `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
}

export function getUtf8Hex(char: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(char);
  return Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

export function lookupCharacter(char: string): CharacterInfo {
  const cp = char.codePointAt(0) ?? 0;
  return {
    character: char,
    codePoint: getCodePoint(char),
    utf8Hex: getUtf8Hex(char),
    htmlEntity: `&#${cp};`,
    name: getCharName(cp),
  };
}

export function searchByName(query: string): CharacterInfo[] {
  const upper = query.toUpperCase();
  const results: CharacterInfo[] = [];

  // Search in known characters
  for (const [cpStr, name] of Object.entries(KNOWN_CHARACTERS)) {
    if (name.includes(upper)) {
      const cp = Number(cpStr);
      const char = String.fromCodePoint(cp);
      results.push(lookupCharacter(char));
    }
    if (results.length >= 50) break;
  }

  // Search in basic Latin letters/digits
  for (let cp = 0x0020; cp <= 0x007e; cp++) {
    const name = getCharName(cp);
    if (name.includes(upper)) {
      const char = String.fromCodePoint(cp);
      if (!results.find((r) => r.codePoint === getCodePoint(char))) {
        results.push(lookupCharacter(char));
      }
    }
    if (results.length >= 50) break;
  }

  return results;
}

export function parseCodePoint(input: string): string | null {
  const match = input.match(/^(?:U\+|0x|\\u)?([0-9a-fA-F]{1,6})$/);
  if (!match) return null;
  const cp = parseInt(match[1], 16);
  if (cp > 0x10ffff) return null;
  try {
    return String.fromCodePoint(cp);
  } catch {
    return null;
  }
}
