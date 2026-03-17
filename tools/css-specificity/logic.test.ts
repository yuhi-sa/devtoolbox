import { describe, it, expect } from "vitest";
import {
  calculateSpecificity,
  specificityScore,
  formatSpecificity,
  compareSelectors,
} from "./logic";

describe("css-specificity", () => {
  it("calculates specificity for type selector", () => {
    expect(calculateSpecificity("div")).toEqual({ a: 0, b: 0, c: 1 });
  });

  it("calculates specificity for class selector", () => {
    expect(calculateSpecificity(".foo")).toEqual({ a: 0, b: 1, c: 0 });
  });

  it("calculates specificity for ID selector", () => {
    expect(calculateSpecificity("#bar")).toEqual({ a: 1, b: 0, c: 0 });
  });

  it("calculates combined selectors", () => {
    expect(calculateSpecificity("div.foo#bar")).toEqual({ a: 1, b: 1, c: 1 });
  });

  it("calculates specificity with pseudo-class", () => {
    expect(calculateSpecificity("a:hover")).toEqual({ a: 0, b: 1, c: 1 });
  });

  it("calculates specificity with pseudo-element", () => {
    expect(calculateSpecificity("p::before")).toEqual({ a: 0, b: 0, c: 2 });
  });

  it("calculates specificity with attribute selector", () => {
    expect(calculateSpecificity("input[type='text']")).toEqual({ a: 0, b: 1, c: 1 });
  });

  it("calculates specificity with multiple classes", () => {
    expect(calculateSpecificity(".a.b.c")).toEqual({ a: 0, b: 3, c: 0 });
  });

  it("calculates score correctly", () => {
    expect(specificityScore({ a: 1, b: 2, c: 3 })).toBe(10203);
  });

  it("formats specificity", () => {
    expect(formatSpecificity({ a: 1, b: 0, c: 2 })).toBe("(1, 0, 2)");
  });

  it("compares and sorts selectors by specificity", () => {
    const results = compareSelectors(["div", ".foo", "#bar"]);
    expect(results[0].selector).toBe("#bar");
    expect(results[1].selector).toBe(".foo");
    expect(results[2].selector).toBe("div");
  });

  it("filters empty selectors", () => {
    const results = compareSelectors(["div", "", "  "]);
    expect(results.length).toBe(1);
  });
});
