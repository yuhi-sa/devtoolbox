export interface SemverParsed {
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
  build: string;
  raw: string;
}

export function parseSemver(version: string): SemverParsed {
  const cleaned = version.trim().replace(/^v/i, "");
  const match = cleaned.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.]+))?(?:\+([a-zA-Z0-9.]+))?$/
  );

  if (!match) {
    throw new Error(`Invalid semver: "${version}"`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || "",
    build: match[5] || "",
    raw: cleaned,
  };
}

function comparePrereleaseIds(a: string, b: string): number {
  if (!a && !b) return 0;
  if (!a) return 1; // no prerelease > has prerelease
  if (!b) return -1;

  const aParts = a.split(".");
  const bParts = b.split(".");

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    if (i >= aParts.length) return -1;
    if (i >= bParts.length) return 1;

    const aNum = /^\d+$/.test(aParts[i]) ? parseInt(aParts[i], 10) : NaN;
    const bNum = /^\d+$/.test(bParts[i]) ? parseInt(bParts[i], 10) : NaN;

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum !== bNum) return aNum - bNum;
    } else if (!isNaN(aNum)) {
      return -1; // numeric < string
    } else if (!isNaN(bNum)) {
      return 1;
    } else {
      const cmp = aParts[i].localeCompare(bParts[i]);
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}

export function compareVersions(a: string, b: string): number {
  const va = parseSemver(a);
  const vb = parseSemver(b);

  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  if (va.patch !== vb.patch) return va.patch - vb.patch;

  return comparePrereleaseIds(va.prerelease, vb.prerelease);
}

export function satisfiesRange(version: string, range: string): boolean {
  const trimmed = range.trim();

  // Handle || (or)
  if (trimmed.includes("||")) {
    return trimmed
      .split("||")
      .some((part) => satisfiesRange(version, part.trim()));
  }

  // Handle space-separated (and)
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    return parts.every((part) => satisfiesRange(version, part));
  }

  const v = parseSemver(version);

  // Exact match
  if (/^\d+\.\d+\.\d+/.test(trimmed) && !trimmed.startsWith("^") && !trimmed.startsWith("~") && !trimmed.startsWith(">") && !trimmed.startsWith("<") && !trimmed.startsWith("=")) {
    const r = parseSemver(trimmed);
    return compareVersions(version, trimmed) === 0;
  }

  // Caret range ^
  if (trimmed.startsWith("^")) {
    const r = parseSemver(trimmed.slice(1));
    if (compareVersions(version, trimmed.slice(1)) < 0) return false;

    if (r.major !== 0) {
      return v.major === r.major;
    } else if (r.minor !== 0) {
      return v.major === 0 && v.minor === r.minor;
    } else {
      return v.major === 0 && v.minor === 0 && v.patch === r.patch;
    }
  }

  // Tilde range ~
  if (trimmed.startsWith("~")) {
    const r = parseSemver(trimmed.slice(1));
    if (compareVersions(version, trimmed.slice(1)) < 0) return false;
    return v.major === r.major && v.minor === r.minor;
  }

  // >= operator
  if (trimmed.startsWith(">=")) {
    return compareVersions(version, trimmed.slice(2).trim()) >= 0;
  }

  // <= operator
  if (trimmed.startsWith("<=")) {
    return compareVersions(version, trimmed.slice(2).trim()) <= 0;
  }

  // > operator
  if (trimmed.startsWith(">") && !trimmed.startsWith(">=")) {
    return compareVersions(version, trimmed.slice(1).trim()) > 0;
  }

  // < operator
  if (trimmed.startsWith("<") && !trimmed.startsWith("<=")) {
    return compareVersions(version, trimmed.slice(1).trim()) < 0;
  }

  // = operator
  if (trimmed.startsWith("=")) {
    return compareVersions(version, trimmed.slice(1).trim()) === 0;
  }

  throw new Error(`Unsupported range format: "${range}"`);
}

export function isValidSemver(version: string): boolean {
  try {
    parseSemver(version);
    return true;
  } catch {
    return false;
  }
}
