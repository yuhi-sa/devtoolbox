import { describe, it, expect } from "vitest";
import { runPipeline } from "./logic";

describe("pipeline", () => {
  it("runs single step", () => {
    const result = runPipeline("hello", ["uppercase"]);
    expect(result.output).toBe("HELLO");
    expect(result.error).toBeUndefined();
  });

  it("chains multiple steps", () => {
    const result = runPipeline("hello world", ["uppercase", "reverse"]);
    expect(result.output).toBe("DLROW OLLEH");
  });

  it("provides intermediate results", () => {
    const result = runPipeline("hello", ["uppercase", "reverse"]);
    expect(result.intermediates).toHaveLength(2);
    expect(result.intermediates[0]).toBe("HELLO");
    expect(result.intermediates[1]).toBe("OLLEH");
  });

  it("handles errors gracefully", () => {
    const result = runPipeline("not json", ["json-format"]);
    expect(result.error).toBeDefined();
  });

  it("reports unknown steps", () => {
    const result = runPipeline("test", ["nonexistent"]);
    expect(result.error).toContain("Unknown transform");
  });

  it("handles empty pipeline", () => {
    const result = runPipeline("hello", []);
    expect(result.output).toBe("hello");
  });
});
