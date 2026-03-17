// Punycode RFC 3492 implementation
const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;
const DELIMITER = "-";
const PREFIX = "xn--";

function adaptBias(delta: number, numPoints: number, firstTime: boolean): number {
  let d = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
  d += Math.floor(d / numPoints);
  let k = 0;
  while (d > ((BASE - TMIN) * TMAX) / 2) {
    d = Math.floor(d / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * d) / (d + SKEW));
}

function digitToChar(d: number): string {
  if (d < 26) return String.fromCharCode(97 + d); // a-z
  return String.fromCharCode(22 + d); // 0-9
}

function charToDigit(c: number): number {
  if (c >= 48 && c <= 57) return c - 22; // 0-9 → 26-35
  if (c >= 65 && c <= 90) return c - 65; // A-Z → 0-25
  if (c >= 97 && c <= 122) return c - 97; // a-z → 0-25
  throw new Error("Invalid Punycode input.");
}

export function punycodeEncode(input: string): string {
  const codePoints = Array.from(input).map((c) => c.codePointAt(0)!);
  const basicChars = codePoints.filter((cp) => cp < 128);
  const output: string[] = basicChars.map((cp) => String.fromCodePoint(cp));

  let h = basicChars.length;
  const b = h;
  if (b > 0) output.push(DELIMITER);

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  while (h < codePoints.length) {
    const m = Math.min(...codePoints.filter((cp) => cp >= n));
    delta += (m - n) * (h + 1);
    n = m;

    for (const cp of codePoints) {
      if (cp < n) {
        delta++;
      } else if (cp === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output.push(digitToChar(t + ((q - t) % (BASE - t))));
          q = Math.floor((q - t) / (BASE - t));
        }
        output.push(digitToChar(q));
        bias = adaptBias(delta, h + 1, h === b);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }

  return output.join("");
}

export function punycodeDecode(input: string): string {
  const output: number[] = [];
  let i = 0;
  let n = INITIAL_N;
  let bias = INITIAL_BIAS;

  let basicEnd = input.lastIndexOf(DELIMITER);
  if (basicEnd < 0) basicEnd = 0;

  for (let j = 0; j < basicEnd; j++) {
    const cp = input.charCodeAt(j);
    if (cp >= 128) throw new Error("Invalid Punycode input.");
    output.push(cp);
  }

  let pos = basicEnd > 0 ? basicEnd + 1 : 0;

  while (pos < input.length) {
    const oldi = i;
    let w = 1;

    for (let k = BASE; ; k += BASE) {
      if (pos >= input.length) throw new Error("Invalid Punycode input.");
      const digit = charToDigit(input.charCodeAt(pos++));
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
    }

    const len = output.length + 1;
    bias = adaptBias(i - oldi, len, oldi === 0);
    n += Math.floor(i / len);
    i %= len;

    output.splice(i, 0, n);
    i++;
  }

  return String.fromCodePoint(...output);
}

export function domainToAce(domain: string): string {
  return domain
    .split(".")
    .map((label) => {
      const hasNonAscii = Array.from(label).some(
        (c) => c.codePointAt(0)! >= 128
      );
      if (!hasNonAscii) return label;
      return PREFIX + punycodeEncode(label);
    })
    .join(".");
}

export function domainFromAce(domain: string): string {
  return domain
    .split(".")
    .map((label) => {
      if (label.toLowerCase().startsWith(PREFIX)) {
        return punycodeDecode(label.slice(PREFIX.length));
      }
      return label;
    })
    .join(".");
}
