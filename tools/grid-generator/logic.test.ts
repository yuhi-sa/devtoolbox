import { describe, it, expect } from "vitest";
import {
  generateGridCSS,
  generateGridTemplateColumns,
  generateGridTemplateRows,
  getCellCount,
  defaultGridOptions,
} from "./logic";

describe("grid-generator", () => {
  it("generates grid template columns", () => {
    expect(generateGridTemplateColumns(3, "1fr")).toBe("repeat(3, 1fr)");
    expect(generateGridTemplateColumns(4, "200px")).toBe("repeat(4, 200px)");
  });

  it("generates grid template rows", () => {
    expect(generateGridTemplateRows(2, "1fr")).toBe("repeat(2, 1fr)");
    expect(generateGridTemplateRows(3, "auto")).toBe("repeat(3, auto)");
  });

  it("generates full grid CSS with uniform gap", () => {
    const css = generateGridCSS(defaultGridOptions);
    expect(css).toContain("display: grid;");
    expect(css).toContain("grid-template-columns: repeat(3, 1fr);");
    expect(css).toContain("grid-template-rows: repeat(3, 1fr);");
    expect(css).toContain("gap: 8px;");
  });

  it("generates grid CSS with separate column/row gaps", () => {
    const css = generateGridCSS({
      ...defaultGridOptions,
      useUniformGap: false,
      columnGap: 10,
      rowGap: 20,
    });
    expect(css).toContain("column-gap: 10px;");
    expect(css).toContain("row-gap: 20px;");
    expect(css).not.toMatch(/^gap:/m);
  });

  it("omits gap when zero", () => {
    const css = generateGridCSS({ ...defaultGridOptions, gap: 0 });
    expect(css).not.toMatch(/^gap:/m);
  });

  it("calculates cell count", () => {
    expect(getCellCount(defaultGridOptions)).toBe(9);
    expect(getCellCount({ ...defaultGridOptions, columns: 4, rows: 2 })).toBe(8);
  });

  it("handles different column sizes", () => {
    const css = generateGridCSS({ ...defaultGridOptions, columnSize: "200px" });
    expect(css).toContain("grid-template-columns: repeat(3, 200px);");
  });

  it("handles minmax column size", () => {
    const css = generateGridCSS({
      ...defaultGridOptions,
      columnSize: "minmax(100px, 1fr)",
    });
    expect(css).toContain("grid-template-columns: repeat(3, minmax(100px, 1fr));");
  });

  it("handles 1 column and 1 row", () => {
    const css = generateGridCSS({ ...defaultGridOptions, columns: 1, rows: 1 });
    expect(css).toContain("grid-template-columns: repeat(1, 1fr);");
    expect(css).toContain("grid-template-rows: repeat(1, 1fr);");
    expect(getCellCount({ ...defaultGridOptions, columns: 1, rows: 1 })).toBe(1);
  });

  it("omits separate gaps when zero", () => {
    const css = generateGridCSS({
      ...defaultGridOptions,
      useUniformGap: false,
      columnGap: 0,
      rowGap: 0,
    });
    expect(css).not.toContain("column-gap:");
    expect(css).not.toContain("row-gap:");
  });
});
