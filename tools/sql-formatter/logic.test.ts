import { describe, it, expect } from "vitest";
import { formatSQL } from "./logic";

describe("sql-formatter", () => {
  it("uppercases SQL keywords", () => {
    const result = formatSQL("select id from users");
    expect(result).toContain("SELECT");
    expect(result).toContain("FROM");
  });

  it("adds newlines before major clauses", () => {
    const result = formatSQL("select id from users where id = 1");
    expect(result).toContain("\nFROM");
    expect(result).toContain("\nWHERE");
  });

  it("indents AND/OR sub-clauses", () => {
    const result = formatSQL("select * from users where id = 1 and name = 'test'");
    expect(result).toContain("  AND");
  });

  it("adds semicolon at end if missing", () => {
    const result = formatSQL("select 1");
    expect(result.trimEnd().endsWith(";")).toBe(true);
  });

  it("handles empty input", () => {
    expect(formatSQL("")).toBe("");
    expect(formatSQL("  ")).toBe("");
  });
});
