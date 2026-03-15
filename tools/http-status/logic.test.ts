import { describe, it, expect } from "vitest";
import { searchStatusCodes, getStatusByCode, HTTP_STATUS_CODES } from "./logic";

describe("http-status", () => {
  it("returns all status codes when query is empty", () => {
    const results = searchStatusCodes("");
    expect(results.length).toBe(HTTP_STATUS_CODES.length);
  });

  it("searches by status code", () => {
    const results = searchStatusCodes("404");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].code).toBe(404);
    expect(results[0].name).toBe("Not Found");
  });

  it("searches by name", () => {
    const results = searchStatusCodes("not found");
    expect(results.some((s) => s.code === 404)).toBe(true);
  });

  it("gets status by code", () => {
    const status = getStatusByCode(200);
    expect(status?.name).toBe("OK");
  });

  it("returns undefined for unknown code", () => {
    expect(getStatusByCode(999)).toBeUndefined();
  });

  it("covers all major categories", () => {
    const categories = new Set(HTTP_STATUS_CODES.map((s) => s.category));
    expect(categories.size).toBe(5);
  });
});
