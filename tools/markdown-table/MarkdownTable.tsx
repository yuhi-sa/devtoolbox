"use client";

import { useState } from "react";
import { generateMarkdownTable } from "./logic";
import type { Alignment } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function MarkdownTable() {
  const [cols, setCols] = useState(3);
  const [rowCount, setRowCount] = useState(3);
  const [headers, setHeaders] = useState<string[]>(["Header 1", "Header 2", "Header 3"]);
  const [rows, setRows] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [alignments, setAlignments] = useState<Alignment[]>(["left", "left", "left"]);

  const updateGrid = (newCols: number, newRows: number) => {
    const newHeaders = Array.from(
      { length: newCols },
      (_, i) => headers[i] || `Header ${i + 1}`
    );
    const newRowData = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => rows[r]?.[c] || "")
    );
    const newAlignments = Array.from(
      { length: newCols },
      (_, i) => alignments[i] || "left"
    );
    setHeaders(newHeaders);
    setRows(newRowData);
    setAlignments(newAlignments);
    setCols(newCols);
    setRowCount(newRows);
  };

  const updateHeader = (index: number, value: string) => {
    const next = [...headers];
    next[index] = value;
    setHeaders(next);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const next = rows.map((r) => [...r]);
    next[row][col] = value;
    setRows(next);
  };

  const updateAlignment = (index: number, value: Alignment) => {
    const next = [...alignments];
    next[index] = value;
    setAlignments(next);
  };

  const output = generateMarkdownTable(headers, rows, alignments);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Columns:
          <input
            type="number"
            min={1}
            max={20}
            value={cols}
            onChange={(e) => updateGrid(Number(e.target.value), rowCount)}
            className="w-16 p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Rows:
          <input
            type="number"
            min={1}
            max={50}
            value={rowCount}
            onChange={(e) => updateGrid(cols, Number(e.target.value))}
            className="w-16 p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="p-1">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    className="w-full p-1.5 text-sm border rounded bg-blue-50 dark:bg-blue-900/30 dark:border-gray-600 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </th>
              ))}
            </tr>
            <tr>
              {alignments.map((a, i) => (
                <th key={i} className="p-1">
                  <select
                    value={a}
                    onChange={(e) =>
                      updateAlignment(i, e.target.value as Alignment)
                    }
                    className="w-full p-1 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full p-1.5 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Markdown
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
