export function timestampToIso(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) {
    throw new Error("無効なタイムスタンプです。");
  }
  return date.toISOString();
}

export function isoToTimestamp(iso: string): number {
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    throw new Error("無効な日時形式です。");
  }
  return Math.floor(date.getTime() / 1000);
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function timestampToLocalString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) {
    throw new Error("無効なタイムスタンプです。");
  }
  return date.toLocaleString();
}
