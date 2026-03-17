import { describe, it, expect } from "vitest";
import { computeInlineDiff, diffChars, InlineSegment } from "./logic";

describe("text-diff-inline", () => {
  it("returns unchanged for identical texts", () => {
    const result = computeInlineDiff("hello\nworld", "hello\nworld");
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("unchanged");
    expect(result[1].type).toBe("unchanged");
  });

  it("detects added lines", () => {
    const result = computeInlineDiff("a", "a\nb");
    expect(result.some((r) => r.type === "added")).toBe(true);
  });

  it("detects removed lines", () => {
    const result = computeInlineDiff("a\nb", "a");
    expect(result.some((r) => r.type === "removed")).toBe(true);
  });

  it("detects modified lines with character-level diff", () => {
    const result = computeInlineDiff("hello world", "hello earth");
    const modified = result.find((r) => r.type === "modified");
    expect(modified).toBeDefined();
    expect(modified!.segments.length).toBeGreaterThan(1);
  });

  it("diffChars handles identical strings", () => {
    const segs = diffChars("abc", "abc");
    expect(segs).toHaveLength(1);
    expect(segs[0]).toEqual({ type: "equal", text: "abc" });
  });

  it("diffChars handles completely different strings", () => {
    const segs = diffChars("abc", "xyz");
    const removed = segs.filter((s) => s.type === "removed");
    const added = segs.filter((s) => s.type === "added");
    expect(removed.length).toBeGreaterThan(0);
    expect(added.length).toBeGreaterThan(0);
  });

  it("diffChars detects insertion", () => {
    const segs = diffChars("ac", "abc");
    const added = segs.filter((s) => s.type === "added");
    expect(added.length).toBeGreaterThan(0);
    expect(added.map((s) => s.text).join("")).toContain("b");
  });

  it("diffChars detects deletion", () => {
    const segs = diffChars("abc", "ac");
    const removed = segs.filter((s) => s.type === "removed");
    expect(removed.length).toBeGreaterThan(0);
    expect(removed.map((s) => s.text).join("")).toContain("b");
  });

  it("handles empty inputs", () => {
    const result = computeInlineDiff("", "");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("unchanged");
  });

  it("assigns line numbers", () => {
    const result = computeInlineDiff("a\nb\nc", "a\nx\nc");
    expect(result[0].lineNumber).toBe(1);
    expect(result[1].lineNumber).toBe(2);
    expect(result[2].lineNumber).toBe(3);
  });
});
