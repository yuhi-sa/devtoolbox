import { describe, it, expect } from "vitest";
import {
  parseSemver,
  compareVersions,
  satisfiesRange,
  isValidSemver,
} from "./logic";

describe("semver-tester", () => {
  describe("parseSemver", () => {
    it("parses basic version", () => {
      const result = parseSemver("1.2.3");
      expect(result.major).toBe(1);
      expect(result.minor).toBe(2);
      expect(result.patch).toBe(3);
    });

    it("parses version with prerelease", () => {
      const result = parseSemver("1.0.0-alpha.1");
      expect(result.prerelease).toBe("alpha.1");
    });

    it("parses version with build metadata", () => {
      const result = parseSemver("1.0.0+build.123");
      expect(result.build).toBe("build.123");
    });

    it("strips v prefix", () => {
      const result = parseSemver("v1.2.3");
      expect(result.major).toBe(1);
    });

    it("throws on invalid version", () => {
      expect(() => parseSemver("invalid")).toThrow();
      expect(() => parseSemver("1.2")).toThrow();
    });
  });

  describe("compareVersions", () => {
    it("compares major versions", () => {
      expect(compareVersions("2.0.0", "1.0.0")).toBeGreaterThan(0);
      expect(compareVersions("1.0.0", "2.0.0")).toBeLessThan(0);
    });

    it("compares minor versions", () => {
      expect(compareVersions("1.2.0", "1.1.0")).toBeGreaterThan(0);
    });

    it("compares patch versions", () => {
      expect(compareVersions("1.0.2", "1.0.1")).toBeGreaterThan(0);
    });

    it("equal versions return 0", () => {
      expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
    });

    it("prerelease < release", () => {
      expect(compareVersions("1.0.0-alpha", "1.0.0")).toBeLessThan(0);
    });
  });

  describe("satisfiesRange", () => {
    it("matches exact version", () => {
      expect(satisfiesRange("1.2.3", "1.2.3")).toBe(true);
      expect(satisfiesRange("1.2.4", "1.2.3")).toBe(false);
    });

    it("matches caret range", () => {
      expect(satisfiesRange("1.2.3", "^1.0.0")).toBe(true);
      expect(satisfiesRange("1.9.9", "^1.0.0")).toBe(true);
      expect(satisfiesRange("2.0.0", "^1.0.0")).toBe(false);
      expect(satisfiesRange("0.9.0", "^1.0.0")).toBe(false);
    });

    it("matches tilde range", () => {
      expect(satisfiesRange("1.2.5", "~1.2.3")).toBe(true);
      expect(satisfiesRange("1.3.0", "~1.2.3")).toBe(false);
      expect(satisfiesRange("1.2.2", "~1.2.3")).toBe(false);
    });

    it("matches >= range", () => {
      expect(satisfiesRange("2.0.0", ">=1.0.0")).toBe(true);
      expect(satisfiesRange("1.0.0", ">=1.0.0")).toBe(true);
      expect(satisfiesRange("0.9.0", ">=1.0.0")).toBe(false);
    });

    it("matches > range", () => {
      expect(satisfiesRange("1.0.1", ">1.0.0")).toBe(true);
      expect(satisfiesRange("1.0.0", ">1.0.0")).toBe(false);
    });

    it("matches < range", () => {
      expect(satisfiesRange("0.9.0", "<1.0.0")).toBe(true);
      expect(satisfiesRange("1.0.0", "<1.0.0")).toBe(false);
    });

    it("matches <= range", () => {
      expect(satisfiesRange("1.0.0", "<=1.0.0")).toBe(true);
      expect(satisfiesRange("1.0.1", "<=1.0.0")).toBe(false);
    });

    it("matches OR ranges", () => {
      expect(satisfiesRange("1.5.0", "^1.0.0 || ^2.0.0")).toBe(true);
      expect(satisfiesRange("2.5.0", "^1.0.0 || ^2.0.0")).toBe(true);
      expect(satisfiesRange("3.0.0", "^1.0.0 || ^2.0.0")).toBe(false);
    });
  });

  describe("isValidSemver", () => {
    it("validates correct versions", () => {
      expect(isValidSemver("1.0.0")).toBe(true);
      expect(isValidSemver("v1.0.0")).toBe(true);
      expect(isValidSemver("1.0.0-alpha")).toBe(true);
    });

    it("rejects invalid versions", () => {
      expect(isValidSemver("invalid")).toBe(false);
      expect(isValidSemver("1.2")).toBe(false);
    });
  });
});
