export type Alignment = "left" | "center" | "right";

export function generateMarkdownTable(
  headers: string[],
  rows: string[][],
  alignments?: Alignment[]
): string {
  if (headers.length === 0) return "";

  const colCount = headers.length;

  const headerRow = "| " + headers.map(escapeCell).join(" | ") + " |";

  const separatorRow =
    "| " +
    headers
      .map((_, i) => {
        const align = alignments?.[i] || "left";
        switch (align) {
          case "center":
            return ":---:";
          case "right":
            return "---:";
          default:
            return "---";
        }
      })
      .join(" | ") +
    " |";

  const bodyRows = rows.map((row) => {
    const cells: string[] = [];
    for (let i = 0; i < colCount; i++) {
      cells.push(escapeCell(row[i] || ""));
    }
    return "| " + cells.join(" | ") + " |";
  });

  return [headerRow, separatorRow, ...bodyRows].join("\n");
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
