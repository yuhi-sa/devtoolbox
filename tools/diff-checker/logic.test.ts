import { describe, it, expect } from "vitest";
import { computeDiff } from "./logic";

describe("diff-checker", () => {
  it("detects no changes for identical text", () => {
    const diff = computeDiff("hello\nworld", "hello\nworld");
    expect(diff.every((l) => l.type === "unchanged")).toBe(true);
  });

  it("detects added lines", () => {
    const diff = computeDiff("a", "a\nb");
    const added = diff.filter((l) => l.type === "added");
    expect(added).toHaveLength(1);
    expect(added[0].text).toBe("b");
  });

  it("detects removed lines", () => {
    const diff = computeDiff("a\nb", "a");
    const removed = diff.filter((l) => l.type === "removed");
    expect(removed).toHaveLength(1);
    expect(removed[0].text).toBe("b");
  });

  it("detects changes", () => {
    const diff = computeDiff("line1\nline2", "line1\nmodified");
    const removed = diff.filter((l) => l.type === "removed");
    const added = diff.filter((l) => l.type === "added");
    expect(removed.length).toBeGreaterThan(0);
    expect(added.length).toBeGreaterThan(0);
  });
});
