export interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

export function permissionsToNumeric(perms: Permissions): string {
  const calc = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  return `${calc(perms.owner)}${calc(perms.group)}${calc(perms.others)}`;
}

export function numericToPermissions(numeric: string): Permissions {
  if (!/^[0-7]{3}$/.test(numeric)) {
    throw new Error("Invalid numeric permission. Use 3 digits (0-7).");
  }
  const parse = (digit: string) => {
    const n = parseInt(digit, 10);
    return { read: !!(n & 4), write: !!(n & 2), execute: !!(n & 1) };
  };
  return {
    owner: parse(numeric[0]),
    group: parse(numeric[1]),
    others: parse(numeric[2]),
  };
}

export function permissionsToSymbolic(perms: Permissions): string {
  const sym = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-");
  return sym(perms.owner) + sym(perms.group) + sym(perms.others);
}

export function symbolicToPermissions(symbolic: string): Permissions {
  if (!/^[rwx-]{9}$/.test(symbolic)) {
    throw new Error("Invalid symbolic permission. Use 9 characters (rwx-).");
  }
  const parse = (s: string) => ({
    read: s[0] === "r",
    write: s[1] === "w",
    execute: s[2] === "x",
  });
  return {
    owner: parse(symbolic.slice(0, 3)),
    group: parse(symbolic.slice(3, 6)),
    others: parse(symbolic.slice(6, 9)),
  };
}
