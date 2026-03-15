export interface AsciiEntry {
  decimal: number;
  hex: string;
  octal: string;
  binary: string;
  character: string;
  description: string;
}

const CONTROL_CHAR_NAMES: Record<number, string> = {
  0: "NUL (Null)",
  1: "SOH (Start of Heading)",
  2: "STX (Start of Text)",
  3: "ETX (End of Text)",
  4: "EOT (End of Transmission)",
  5: "ENQ (Enquiry)",
  6: "ACK (Acknowledge)",
  7: "BEL (Bell)",
  8: "BS (Backspace)",
  9: "HT (Horizontal Tab)",
  10: "LF (Line Feed)",
  11: "VT (Vertical Tab)",
  12: "FF (Form Feed)",
  13: "CR (Carriage Return)",
  14: "SO (Shift Out)",
  15: "SI (Shift In)",
  16: "DLE (Data Link Escape)",
  17: "DC1 (Device Control 1)",
  18: "DC2 (Device Control 2)",
  19: "DC3 (Device Control 3)",
  20: "DC4 (Device Control 4)",
  21: "NAK (Negative Acknowledge)",
  22: "SYN (Synchronous Idle)",
  23: "ETB (End of Trans. Block)",
  24: "CAN (Cancel)",
  25: "EM (End of Medium)",
  26: "SUB (Substitute)",
  27: "ESC (Escape)",
  28: "FS (File Separator)",
  29: "GS (Group Separator)",
  30: "RS (Record Separator)",
  31: "US (Unit Separator)",
  32: "Space",
  127: "DEL (Delete)",
};

export function getCharDescription(code: number): string {
  if (CONTROL_CHAR_NAMES[code]) return CONTROL_CHAR_NAMES[code];
  if (code >= 33 && code <= 47) return "Punctuation";
  if (code >= 48 && code <= 57) return "Digit";
  if (code >= 58 && code <= 64) return "Punctuation";
  if (code >= 65 && code <= 90) return "Uppercase Letter";
  if (code >= 91 && code <= 96) return "Punctuation";
  if (code >= 97 && code <= 122) return "Lowercase Letter";
  if (code >= 123 && code <= 126) return "Punctuation";
  return "";
}

export function getDisplayChar(code: number): string {
  if (code < 32 || code === 127) return "";
  return String.fromCharCode(code);
}

export function buildAsciiTable(): AsciiEntry[] {
  const entries: AsciiEntry[] = [];
  for (let i = 0; i <= 127; i++) {
    entries.push({
      decimal: i,
      hex: i.toString(16).toUpperCase().padStart(2, "0"),
      octal: i.toString(8).padStart(3, "0"),
      binary: i.toString(2).padStart(8, "0"),
      character: getDisplayChar(i),
      description: getCharDescription(i),
    });
  }
  return entries;
}

export function filterAsciiTable(entries: AsciiEntry[], query: string): AsciiEntry[] {
  if (!query.trim()) return entries;
  const q = query.toLowerCase().trim();

  // If query is a single character, match by character
  if (q.length === 1) {
    const code = q.charCodeAt(0);
    return entries.filter((e) => e.decimal === code || e.decimal === code - 32 || e.decimal === code + 32);
  }

  // Try matching as a number (decimal)
  const num = parseInt(q, 10);
  if (!isNaN(num) && num >= 0 && num <= 127) {
    return entries.filter((e) => e.decimal === num);
  }

  // Try matching hex (0x prefix)
  if (q.startsWith("0x")) {
    const hexNum = parseInt(q, 16);
    if (!isNaN(hexNum) && hexNum >= 0 && hexNum <= 127) {
      return entries.filter((e) => e.decimal === hexNum);
    }
  }

  return entries.filter(
    (e) =>
      e.description.toLowerCase().includes(q) ||
      e.character.toLowerCase().includes(q) ||
      e.hex.toLowerCase().includes(q)
  );
}
