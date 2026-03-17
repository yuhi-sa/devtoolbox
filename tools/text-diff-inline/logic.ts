export interface InlineSegment {
  type: "equal" | "added" | "removed";
  text: string;
}

export interface InlineDiffLine {
  lineNumber: number;
  segments: InlineSegment[];
  type: "unchanged" | "modified" | "added" | "removed";
}

/**
 * Compute character-level inline diff between two strings.
 * Uses LCS on lines first, then character-level diff on changed lines.
 */
export function computeInlineDiff(
  textA: string,
  textB: string
): InlineDiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const lineDiff = diffLines(linesA, linesB);
  const result: InlineDiffLine[] = [];
  let lineNum = 1;

  for (const entry of lineDiff) {
    if (entry.type === "equal") {
      result.push({
        lineNumber: lineNum++,
        segments: [{ type: "equal", text: entry.textA }],
        type: "unchanged",
      });
    } else if (entry.type === "removed") {
      result.push({
        lineNumber: lineNum++,
        segments: [{ type: "removed", text: entry.textA }],
        type: "removed",
      });
    } else if (entry.type === "added") {
      result.push({
        lineNumber: lineNum++,
        segments: [{ type: "added", text: entry.textB }],
        type: "added",
      });
    } else if (entry.type === "changed") {
      const charDiff = diffChars(entry.textA, entry.textB);
      result.push({
        lineNumber: lineNum++,
        segments: charDiff,
        type: "modified",
      });
    }
  }

  return result;
}

interface LineDiffEntry {
  type: "equal" | "removed" | "added" | "changed";
  textA: string;
  textB: string;
}

function diffLines(linesA: string[], linesB: string[]): LineDiffEntry[] {
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const entries: LineDiffEntry[] = [];
  let i = m;
  let j = n;
  const stack: LineDiffEntry[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      stack.push({ type: "equal", textA: linesA[i - 1], textB: linesB[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", textA: "", textB: linesB[j - 1] });
      j--;
    } else {
      stack.push({ type: "removed", textA: linesA[i - 1], textB: "" });
      i--;
    }
  }

  // Reverse
  while (stack.length > 0) {
    entries.push(stack.pop()!);
  }

  // Merge adjacent removed+added into "changed"
  const merged: LineDiffEntry[] = [];
  let idx = 0;
  while (idx < entries.length) {
    if (
      idx + 1 < entries.length &&
      entries[idx].type === "removed" &&
      entries[idx + 1].type === "added"
    ) {
      merged.push({
        type: "changed",
        textA: entries[idx].textA,
        textB: entries[idx + 1].textB,
      });
      idx += 2;
    } else {
      merged.push(entries[idx]);
      idx++;
    }
  }

  return merged;
}

/**
 * Character-level diff using LCS.
 */
export function diffChars(a: string, b: string): InlineSegment[] {
  const charsA = Array.from(a);
  const charsB = Array.from(b);
  const m = charsA.length;
  const n = charsB.length;

  // Use two rows for space efficiency
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (charsA[i - 1] === charsB[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    prev = curr;
  }

  // We need the full table for backtracking, rebuild it
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (charsA[i - 1] === charsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const segments: InlineSegment[] = [];
  let ci = m;
  let cj = n;
  const stack: InlineSegment[] = [];

  while (ci > 0 || cj > 0) {
    if (ci > 0 && cj > 0 && charsA[ci - 1] === charsB[cj - 1]) {
      stack.push({ type: "equal", text: charsA[ci - 1] });
      ci--;
      cj--;
    } else if (cj > 0 && (ci === 0 || dp[ci][cj - 1] >= dp[ci - 1][cj])) {
      stack.push({ type: "added", text: charsB[cj - 1] });
      cj--;
    } else {
      stack.push({ type: "removed", text: charsA[ci - 1] });
      ci--;
    }
  }

  // Reverse and merge consecutive same-type segments
  const raw: InlineSegment[] = [];
  while (stack.length > 0) {
    raw.push(stack.pop()!);
  }

  for (const seg of raw) {
    if (segments.length > 0 && segments[segments.length - 1].type === seg.type) {
      segments[segments.length - 1].text += seg.text;
    } else {
      segments.push({ ...seg });
    }
  }

  return segments;
}
