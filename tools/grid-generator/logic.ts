export type GridSizeUnit = "fr" | "px" | "%" | "auto" | "minmax";

export interface GridOptions {
  columns: number;
  rows: number;
  columnSize: string;
  rowSize: string;
  gap: number;
  columnGap: number;
  rowGap: number;
  useUniformGap: boolean;
}

export const defaultGridOptions: GridOptions = {
  columns: 3,
  rows: 3,
  columnSize: "1fr",
  rowSize: "1fr",
  gap: 8,
  columnGap: 8,
  rowGap: 8,
  useUniformGap: true,
};

export function generateGridTemplateColumns(columns: number, size: string): string {
  return `repeat(${columns}, ${size})`;
}

export function generateGridTemplateRows(rows: number, size: string): string {
  return `repeat(${rows}, ${size})`;
}

export function generateGridCSS(options: GridOptions): string {
  const lines: string[] = ["display: grid;"];

  lines.push(
    `grid-template-columns: ${generateGridTemplateColumns(options.columns, options.columnSize)};`
  );

  lines.push(
    `grid-template-rows: ${generateGridTemplateRows(options.rows, options.rowSize)};`
  );

  if (options.useUniformGap) {
    if (options.gap > 0) {
      lines.push(`gap: ${options.gap}px;`);
    }
  } else {
    if (options.columnGap > 0) {
      lines.push(`column-gap: ${options.columnGap}px;`);
    }
    if (options.rowGap > 0) {
      lines.push(`row-gap: ${options.rowGap}px;`);
    }
  }

  return lines.join("\n");
}

export function getCellCount(options: GridOptions): number {
  return options.columns * options.rows;
}

export const COLUMN_SIZE_OPTIONS = ["1fr", "2fr", "auto", "100px", "150px", "200px", "minmax(100px, 1fr)"];
export const ROW_SIZE_OPTIONS = ["1fr", "2fr", "auto", "50px", "100px", "150px", "minmax(50px, 1fr)"];
