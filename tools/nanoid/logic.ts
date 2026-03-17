const ALPHABETS = {
  nanoid:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-",
  alphanumeric:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789abcdef",
  numeric: "0123456789",
  lowercase: "abcdefghijklmnopqrstuvwxyz0123456789",
} as const;

export type AlphabetType = keyof typeof ALPHABETS;

export function getAlphabet(type: AlphabetType): string {
  return ALPHABETS[type];
}

export function generateId(
  length: number,
  alphabet: string
): string {
  if (length < 1 || length > 256) {
    throw new Error("Length must be between 1 and 256.");
  }
  if (alphabet.length === 0) {
    throw new Error("Alphabet must not be empty.");
  }
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

export function generateNanoid(length: number = 21): string {
  return generateId(length, ALPHABETS.nanoid);
}

export function generateUlidLike(): string {
  const now = Date.now();
  const timeStr = now.toString(36).padStart(10, "0").toUpperCase();
  const randomPart = generateId(16, "0123456789ABCDEFGHJKMNPQRSTVWXYZ");
  return timeStr + randomPart;
}

export function generateSnowflakeLike(): string {
  const epoch = BigInt(1609459200000); // 2021-01-01
  const now = BigInt(Date.now());
  const timestamp = now - epoch;
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const random =
    BigInt(bytes[0]) |
    (BigInt(bytes[1]) << BigInt(8)) |
    (BigInt(bytes[2]) << BigInt(16)) |
    (BigInt(bytes[3]) << BigInt(24));
  const id = (timestamp << BigInt(22)) | (random & BigInt(0x3fffff));
  return id.toString();
}

export function batchGenerate(
  count: number,
  generator: () => string
): string[] {
  if (count < 1 || count > 1000) {
    throw new Error("Count must be between 1 and 1000.");
  }
  return Array.from({ length: count }, () => generator());
}
