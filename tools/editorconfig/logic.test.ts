import { describe, it, expect } from "vitest";
import {
  generateEditorConfig,
  getDefaultOptions,
  LANGUAGE_PRESETS,
} from "./logic";

describe("editorconfig", () => {
  it("generates root = true for default", () => {
    const result = generateEditorConfig(getDefaultOptions());
    expect(result).toContain("root = true");
  });

  it("generates empty config with no sections", () => {
    const result = generateEditorConfig(getDefaultOptions());
    expect(result.trim()).toBe("root = true");
  });

  it("generates a section with correct properties", () => {
    const opts = {
      root: true,
      sections: [LANGUAGE_PRESETS.javascript],
    };
    const result = generateEditorConfig(opts);
    expect(result).toContain("[*.{js,jsx}]");
    expect(result).toContain("indent_style = space");
    expect(result).toContain("indent_size = 2");
    expect(result).toContain("charset = utf-8");
    expect(result).toContain("end_of_line = lf");
    expect(result).toContain("trim_trailing_whitespace = true");
    expect(result).toContain("insert_final_newline = true");
  });

  it("includes tab_width for tab indent style", () => {
    const opts = {
      root: true,
      sections: [LANGUAGE_PRESETS.go],
    };
    const result = generateEditorConfig(opts);
    expect(result).toContain("indent_style = tab");
    expect(result).toContain("tab_width = 4");
  });

  it("does not include tab_width for space indent style", () => {
    const opts = {
      root: true,
      sections: [LANGUAGE_PRESETS.python],
    };
    const result = generateEditorConfig(opts);
    expect(result).not.toContain("tab_width");
  });

  it("generates multiple sections", () => {
    const opts = {
      root: true,
      sections: [LANGUAGE_PRESETS.all, LANGUAGE_PRESETS.makefile],
    };
    const result = generateEditorConfig(opts);
    expect(result).toContain("[*]");
    expect(result).toContain("[Makefile]");
  });

  it("has presets for common languages", () => {
    expect(Object.keys(LANGUAGE_PRESETS).length).toBeGreaterThanOrEqual(10);
  });

  it("markdown preset disables trim trailing whitespace", () => {
    expect(LANGUAGE_PRESETS.markdown.trimTrailingWhitespace).toBe(false);
  });
});
