import { describe, it, expect } from "vitest";
import { testRegex } from "./logic";

describe("regex-tester", () => {
  it("finds matches with global flag", () => {
    const result = testRegex("\\d+", "g", "abc 123 def 456");
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].match).toBe("123");
    expect(result.matches[1].match).toBe("456");
  });

  it("finds single match without global flag", () => {
    const result = testRegex("\\d+", "", "abc 123 def 456");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].match).toBe("123");
  });

  it("returns groups", () => {
    const result = testRegex("(\\w+)@(\\w+)", "g", "user@host");
    expect(result.matches[0].groups).toEqual(["user", "host"]);
  });

  it("handles invalid regex", () => {
    const result = testRegex("[invalid", "", "test");
    expect(result.error).toBeDefined();
    expect(result.matches).toHaveLength(0);
  });

  it("handles no matches", () => {
    const result = testRegex("xyz", "g", "abc");
    expect(result.matches).toHaveLength(0);
  });
});
