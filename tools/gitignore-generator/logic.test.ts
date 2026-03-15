import { describe, it, expect } from "vitest";
import { getTemplates, generateGitignore } from "./logic";

describe("gitignore-generator", () => {
  it("returns a non-empty list of templates", () => {
    const templates = getTemplates();
    expect(templates.length).toBeGreaterThan(0);
  });

  it("generates gitignore for Node.js", () => {
    const result = generateGitignore(["node"]);
    expect(result).toContain("node_modules/");
    expect(result).toContain("# Node.js");
  });

  it("generates gitignore for Python", () => {
    const result = generateGitignore(["python"]);
    expect(result).toContain("__pycache__/");
    expect(result).toContain("venv/");
  });

  it("combines multiple templates with section headers", () => {
    const result = generateGitignore(["node", "macos"]);
    expect(result).toContain("# Node.js");
    expect(result).toContain("# macOS");
    expect(result).toContain("node_modules/");
    expect(result).toContain(".DS_Store");
  });

  it("ignores unknown template ids", () => {
    const result = generateGitignore(["nonexistent"]);
    expect(result.trim()).toBe("");
  });

  it("includes all expected categories", () => {
    const templates = getTemplates();
    const categories = new Set(templates.map((t) => t.category));
    expect(categories).toContain("language");
    expect(categories).toContain("framework");
    expect(categories).toContain("os");
    expect(categories).toContain("editor");
  });
});
