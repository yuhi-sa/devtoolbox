import { describe, it, expect } from "vitest";
import { generateUuid, generateBulkUuids, validateUuid } from "./logic";

describe("uuid-generator", () => {
  it("generates a valid v4 UUID", () => {
    const uuid = generateUuid();
    expect(validateUuid(uuid)).toBe(true);
  });

  it("generates unique UUIDs", () => {
    const a = generateUuid();
    const b = generateUuid();
    expect(a).not.toBe(b);
  });

  it("bulk generates the correct count", () => {
    const uuids = generateBulkUuids(10);
    expect(uuids).toHaveLength(10);
    uuids.forEach((u) => expect(validateUuid(u)).toBe(true));
  });

  it("throws on invalid bulk count", () => {
    expect(() => generateBulkUuids(0)).toThrow();
    expect(() => generateBulkUuids(1001)).toThrow();
  });

  it("validates correct UUID format", () => {
    expect(validateUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects invalid UUID format", () => {
    expect(validateUuid("not-a-uuid")).toBe(false);
    expect(validateUuid("550e8400-e29b-41d4-a716")).toBe(false);
  });
});
