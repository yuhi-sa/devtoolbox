import { describe, it, expect } from "vitest";
import { generateTsconfig, getDefaultOptions } from "./logic";

describe("tsconfig", () => {
  it("generates valid JSON", () => {
    const result = generateTsconfig(getDefaultOptions());
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("includes target and module", () => {
    const result = JSON.parse(generateTsconfig(getDefaultOptions()));
    expect(result.compilerOptions.target).toBe("ES2022");
    expect(result.compilerOptions.module).toBe("ESNext");
  });

  it("includes strict mode", () => {
    const result = JSON.parse(generateTsconfig(getDefaultOptions()));
    expect(result.compilerOptions.strict).toBe(true);
  });

  it("includes individual strict options when strict is false", () => {
    const opts = {
      ...getDefaultOptions(),
      strict: false,
      strictNullChecks: true,
      noImplicitAny: true,
    };
    const result = JSON.parse(generateTsconfig(opts));
    expect(result.compilerOptions.strict).toBe(false);
    expect(result.compilerOptions.strictNullChecks).toBe(true);
    expect(result.compilerOptions.noImplicitAny).toBe(true);
  });

  it("includes outDir and rootDir", () => {
    const result = JSON.parse(generateTsconfig(getDefaultOptions()));
    expect(result.compilerOptions.outDir).toBe("./dist");
    expect(result.compilerOptions.rootDir).toBe("./src");
  });

  it("includes paths when provided", () => {
    const opts = {
      ...getDefaultOptions(),
      paths: [{ alias: "@/*", path: "./src/*" }],
    };
    const result = JSON.parse(generateTsconfig(opts));
    expect(result.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
  });

  it("excludes paths when empty", () => {
    const opts = { ...getDefaultOptions(), paths: [] };
    const result = JSON.parse(generateTsconfig(opts));
    expect(result.compilerOptions.paths).toBeUndefined();
  });

  it("includes jsx when set", () => {
    const opts = { ...getDefaultOptions(), jsx: "react-jsx" };
    const result = JSON.parse(generateTsconfig(opts));
    expect(result.compilerOptions.jsx).toBe("react-jsx");
  });

  it("excludes jsx when empty", () => {
    const opts = { ...getDefaultOptions(), jsx: "" };
    const result = JSON.parse(generateTsconfig(opts));
    expect(result.compilerOptions.jsx).toBeUndefined();
  });

  it("includes include and exclude arrays", () => {
    const result = JSON.parse(generateTsconfig(getDefaultOptions()));
    expect(result.include).toContain("src");
    expect(result.exclude).toContain("node_modules");
  });

  it("includes lib array", () => {
    const result = JSON.parse(generateTsconfig(getDefaultOptions()));
    expect(result.compilerOptions.lib).toContain("ES2022");
    expect(result.compilerOptions.lib).toContain("DOM");
  });
});
