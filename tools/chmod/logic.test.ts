import { describe, it, expect } from "vitest";
import {
  permissionsToNumeric,
  numericToPermissions,
  permissionsToSymbolic,
  symbolicToPermissions,
} from "./logic";

describe("chmod", () => {
  it("converts permissions to numeric 755", () => {
    const perms = {
      owner: { read: true, write: true, execute: true },
      group: { read: true, write: false, execute: true },
      others: { read: true, write: false, execute: true },
    };
    expect(permissionsToNumeric(perms)).toBe("755");
  });

  it("converts numeric 644 to permissions", () => {
    const perms = numericToPermissions("644");
    expect(perms.owner).toEqual({ read: true, write: true, execute: false });
    expect(perms.group).toEqual({ read: true, write: false, execute: false });
    expect(perms.others).toEqual({ read: true, write: false, execute: false });
  });

  it("converts permissions to symbolic rwxr-xr-x", () => {
    const perms = numericToPermissions("755");
    expect(permissionsToSymbolic(perms)).toBe("rwxr-xr-x");
  });

  it("converts symbolic to permissions", () => {
    const perms = symbolicToPermissions("rw-r--r--");
    expect(permissionsToNumeric(perms)).toBe("644");
  });

  it("throws on invalid numeric input", () => {
    expect(() => numericToPermissions("999")).toThrow();
    expect(() => numericToPermissions("ab")).toThrow();
  });

  it("handles 000 permissions", () => {
    const perms = numericToPermissions("000");
    expect(permissionsToSymbolic(perms)).toBe("---------");
  });
});
