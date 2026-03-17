// Bitcoin Base58 alphabet
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE = BigInt(58);

const ALPHABET_MAP = new Map<string, bigint>();
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP.set(ALPHABET[i], BigInt(i));
}

export function base58Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return base58EncodeBytes(bytes);
}

export function base58EncodeBytes(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";

  // Count leading zeros
  let leadingZeros = 0;
  for (const b of bytes) {
    if (b === 0) leadingZeros++;
    else break;
  }

  // Convert bytes to bigint
  let num = BigInt(0);
  for (const b of bytes) {
    num = num * BigInt(256) + BigInt(b);
  }

  // Convert to base58
  let encoded = "";
  while (num > BigInt(0)) {
    const remainder = num % BASE;
    num = num / BASE;
    encoded = ALPHABET[Number(remainder)] + encoded;
  }

  // Add leading '1's for each leading zero byte
  return ALPHABET[0].repeat(leadingZeros) + encoded;
}

export function base58Decode(input: string): string {
  const bytes = base58DecodeToBytes(input);
  return new TextDecoder().decode(bytes);
}

export function base58DecodeToBytes(input: string): Uint8Array {
  if (input.length === 0) return new Uint8Array(0);

  // Count leading '1's (zero bytes)
  let leadingOnes = 0;
  for (const c of input) {
    if (c === ALPHABET[0]) leadingOnes++;
    else break;
  }

  // Convert from base58 to bigint
  let num = BigInt(0);
  for (const c of input) {
    const val = ALPHABET_MAP.get(c);
    if (val === undefined) {
      throw new Error(`Invalid Base58 character: '${c}'`);
    }
    num = num * BASE + val;
  }

  // Convert bigint to bytes
  const hexStr = num === BigInt(0) ? "" : num.toString(16);
  const paddedHex = hexStr.length % 2 === 0 ? hexStr : "0" + hexStr;
  const byteCount = paddedHex.length / 2;
  const result = new Uint8Array(leadingOnes + byteCount);

  for (let i = 0; i < byteCount; i++) {
    result[leadingOnes + i] = parseInt(paddedHex.slice(i * 2, i * 2 + 2), 16);
  }

  return result;
}

/**
 * SHA-256 hash using Web Crypto API (returns Promise).
 * For Base58Check we need double SHA-256.
 */
async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest("SHA-256", data as unknown as ArrayBuffer);
  return new Uint8Array(hash);
}

/**
 * Base58Check encode: version byte + payload + 4-byte checksum
 */
export async function base58CheckEncode(
  payload: Uint8Array,
  version: number = 0
): Promise<string> {
  const versioned = new Uint8Array(1 + payload.length);
  versioned[0] = version;
  versioned.set(payload, 1);

  const hash1 = await sha256(versioned);
  const hash2 = await sha256(hash1);
  const checksum = hash2.slice(0, 4);

  const full = new Uint8Array(versioned.length + 4);
  full.set(versioned);
  full.set(checksum, versioned.length);

  return base58EncodeBytes(full);
}

/**
 * Base58Check decode: verify checksum and return payload
 */
export async function base58CheckDecode(
  input: string
): Promise<{ version: number; payload: Uint8Array }> {
  const bytes = base58DecodeToBytes(input);
  if (bytes.length < 5) {
    throw new Error("Base58Check input too short.");
  }

  const versioned = bytes.slice(0, bytes.length - 4);
  const checksum = bytes.slice(bytes.length - 4);

  const hash1 = await sha256(versioned);
  const hash2 = await sha256(hash1);
  const expectedChecksum = hash2.slice(0, 4);

  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== expectedChecksum[i]) {
      throw new Error("Base58Check checksum mismatch.");
    }
  }

  return {
    version: versioned[0],
    payload: versioned.slice(1),
  };
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s/g, "");
  if (clean.length % 2 !== 0) throw new Error("Invalid hex string.");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}
