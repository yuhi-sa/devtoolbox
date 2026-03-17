const TRANSLITERATIONS: Record<string, string> = {
  "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a",
  "è": "e", "é": "e", "ê": "e", "ë": "e",
  "ì": "i", "í": "i", "î": "i", "ï": "i",
  "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o",
  "ù": "u", "ú": "u", "û": "u", "ü": "u",
  "ñ": "n", "ç": "c", "ß": "ss", "ø": "o", "æ": "ae",
  "œ": "oe", "ð": "d", "þ": "th", "ý": "y", "ÿ": "y",
  "À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A",
  "È": "E", "É": "E", "Ê": "E", "Ë": "E",
  "Ì": "I", "Í": "I", "Î": "I", "Ï": "I",
  "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O",
  "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U",
  "Ñ": "N", "Ç": "C", "Ø": "O", "Æ": "AE",
  "Œ": "OE", "Ð": "D", "Þ": "TH", "Ý": "Y",
};

export type Separator = "-" | "_" | ".";

export interface SlugOptions {
  separator: Separator;
  lowercase: boolean;
  transliterate: boolean;
  maxLength?: number;
}

export function transliterateText(input: string): string {
  return input
    .split("")
    .map((ch) => TRANSLITERATIONS[ch] || ch)
    .join("");
}

export function generateSlug(input: string, options: SlugOptions): string {
  if (!input.trim()) return "";

  let result = input;

  if (options.transliterate) {
    result = transliterateText(result);
  }

  if (options.lowercase) {
    result = result.toLowerCase();
  }

  // Remove non-alphanumeric characters (except spaces and the separator)
  result = result.replace(/[^\w\s-]/g, "");

  // Replace whitespace and hyphens with the separator
  result = result.replace(/[\s_-]+/g, options.separator);

  // Remove leading/trailing separators
  result = result.replace(new RegExp(`^\\${options.separator}+|\\${options.separator}+$`, "g"), "");

  if (options.maxLength && options.maxLength > 0) {
    result = result.slice(0, options.maxLength);
    // Don't end with a separator
    result = result.replace(new RegExp(`\\${options.separator}+$`), "");
  }

  return result;
}

export const defaultOptions: SlugOptions = {
  separator: "-",
  lowercase: true,
  transliterate: true,
};
