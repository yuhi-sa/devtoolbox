import { describe, it, expect } from "vitest";
import { generateEslintConfig, getDefaultOptions, EslintOptions } from "./logic";

describe("eslint-config", () => {
  it("generates config with default options", () => {
    const config = generateEslintConfig(getDefaultOptions());
    expect(config).toContain('import js from "@eslint/js"');
    expect(config).toContain("tseslint");
    expect(config).toContain("react");
    expect(config).toContain("prettier");
    expect(config).toContain("export default [");
  });

  it("includes TypeScript config when enabled", () => {
    const opts = getDefaultOptions();
    opts.typescript = true;
    const config = generateEslintConfig(opts);
    expect(config).toContain("typescript-eslint");
    expect(config).toContain("tseslint.configs.recommended");
  });

  it("excludes TypeScript when disabled", () => {
    const opts = getDefaultOptions();
    opts.typescript = false;
    const config = generateEslintConfig(opts);
    expect(config).not.toContain("tseslint");
  });

  it("includes Vue plugin for Vue framework", () => {
    const opts: EslintOptions = {
      framework: "vue",
      typescript: false,
      style: "none",
      plugins: { prettier: false, importPlugin: false, unusedImports: false, a11y: false },
    };
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-plugin-vue");
  });

  it("includes Airbnb style", () => {
    const opts = getDefaultOptions();
    opts.style = "airbnb";
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-config-airbnb-flat");
  });

  it("includes Standard style", () => {
    const opts = getDefaultOptions();
    opts.style = "standard";
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-config-standard-flat");
  });

  it("includes unused-imports plugin", () => {
    const opts = getDefaultOptions();
    opts.plugins.unusedImports = true;
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-plugin-unused-imports");
    expect(config).toContain("unused-imports/no-unused-imports");
  });

  it("includes a11y for React", () => {
    const opts = getDefaultOptions();
    opts.plugins.a11y = true;
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-plugin-jsx-a11y");
  });

  it("does not include a11y for non-React", () => {
    const opts: EslintOptions = {
      framework: "node",
      typescript: false,
      style: "none",
      plugins: { prettier: false, importPlugin: false, unusedImports: false, a11y: true },
    };
    const config = generateEslintConfig(opts);
    expect(config).not.toContain("jsx-a11y");
  });

  it("includes import plugin", () => {
    const opts = getDefaultOptions();
    opts.plugins.importPlugin = true;
    const config = generateEslintConfig(opts);
    expect(config).toContain("eslint-plugin-import");
  });

  it("Node framework has no react/vue imports", () => {
    const opts: EslintOptions = {
      framework: "node",
      typescript: false,
      style: "none",
      plugins: { prettier: false, importPlugin: false, unusedImports: false, a11y: false },
    };
    const config = generateEslintConfig(opts);
    expect(config).not.toContain("eslint-plugin-react");
    expect(config).not.toContain("eslint-plugin-vue");
  });
});
