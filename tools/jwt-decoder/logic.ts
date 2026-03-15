export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }
  return atob(base64);
}

export function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("無効なJWT形式です。3つのパートが必要です。");
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    throw new Error("ヘッダーのデコードに失敗しました。");
  }

  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error("ペイロードのデコードに失敗しました。");
  }

  return {
    header,
    payload,
    signature: parts[2],
  };
}

export function checkExpiration(payload: Record<string, unknown>): {
  hasExp: boolean;
  expired: boolean;
  expiresAt: string | null;
} {
  if (typeof payload.exp !== "number") {
    return { hasExp: false, expired: false, expiresAt: null };
  }

  const expDate = new Date(payload.exp * 1000);
  const now = new Date();

  return {
    hasExp: true,
    expired: now > expDate,
    expiresAt: expDate.toISOString(),
  };
}
