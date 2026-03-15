export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  lineNumber?: number;
}

export function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");

  // Simple LCS-based diff
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

  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      stack.push({ type: "unchanged", text: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: linesB[j - 1] });
      j--;
    } else {
      stack.push({ type: "removed", text: linesA[i - 1] });
      i--;
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}
