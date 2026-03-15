export function generateUuid(): string {
  return crypto.randomUUID();
}

export function generateBulkUuids(count: number): string[] {
  if (count < 1 || count > 1000) {
    throw new Error("生成数は1〜1000の範囲で指定してください。");
  }
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function validateUuid(input: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input.trim());
}
