function base64UrlEncode(str: string): string {
  // Use TextEncoder for UTF-8 bytes
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function encodeHeader(header: object): string {
  return base64UrlEncode(JSON.stringify(header));
}

export function encodePayload(payload: object): string {
  return base64UrlEncode(JSON.stringify(payload));
}

export function buildUnsignedToken(header: object, payload: object): string {
  return `${encodeHeader(header)}.${encodePayload(payload)}`;
}

export async function signHS256(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

export async function generateJwt(
  header: object,
  payload: object,
  secret: string
): Promise<string> {
  const unsigned = buildUnsignedToken(header, payload);
  const signature = await signHS256(unsigned, secret);
  return `${unsigned}.${signature}`;
}

export function decodeJwtParts(token: string): {
  header: string;
  payload: string;
  signature: string;
} | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return {
      header: JSON.stringify(JSON.parse(header), null, 2),
      payload: JSON.stringify(JSON.parse(payload), null, 2),
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

export function getDefaultHeader(): object {
  return { alg: "HS256", typ: "JWT" };
}

export function getDefaultPayload(): object {
  return {
    sub: "1234567890",
    name: "John Doe",
    iat: Math.floor(Date.now() / 1000),
  };
}
