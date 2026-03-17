"use client";

import { useState } from "react";
import {
  GridOptions,
  defaultGridOptions,
  generateGridCSS,
  getCellCount,
  COLUMN_SIZE_OPTIONS,
  ROW_SIZE_OPTIONS,
} from "./logic";
import CopyButton from "@/components/CopyButton";

const CELL_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-rose-500",
];

export default function GridGenerator() {
  const [options, setOptions] = useState<GridOptions>(defaultGridOptions);

  const update = <K extends keyof GridOptions>(key: K, value: GridOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const css = generateGridCSS(options);
  const cellCount = getCellCount(options);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Columns:
          <input
            type="number"
            min={1}
            max={12}
            value={options.columns}
            onChange={(e) => update("columns", Math.max(1, Math.min(12, Number(e.target.value))))}
            className="w-16 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Rows:
          <input
            type="number"
            min={1}
            max={12}
            value={options.rows}
            onChange={(e) => update("rows", Math.max(1, Math.min(12, Number(e.target.value))))}
            className="w-16 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Column Size:
          <select
            value={options.columnSize}
            onChange={(e) => update("columnSize", e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {COLUMN_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Row Size:
          <select
            value={options.rowSize}
            onChange={(e) => update("rowSize", e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {ROW_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={options.useUniformGap}
            onChange={(e) => update("useUniformGap", e.target.checked)}
          />
          Uniform gap
        </label>

        {options.useUniformGap ? (
          <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            Gap: {options.gap}px
            <input
              type="range"
              min={0}
              max={40}
              value={options.gap}
              onChange={(e) => update("gap", Number(e.target.value))}
              className="w-32"
            />
          </label>
        ) : (
          <>
            <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              Column Gap: {options.columnGap}px
              <input
                type="range"
                min={0}
                max={40}
                value={options.columnGap}
                onChange={(e) => update("columnGap", Number(e.target.value))}
                className="w-32"
              />
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              Row Gap: {options.rowGap}px
              <input
                type="range"
                min={0}
                max={40}
                value={options.rowGap}
                onChange={(e) => update("rowGap", Number(e.target.value))}
                className="w-32"
              />
            </label>
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Preview ({cellCount} cells)
        </label>
        <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 min-h-[200px]">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${options.columns}, 1fr)`,
              gridTemplateRows: `repeat(${options.rows}, 60px)`,
              gap: options.useUniformGap
                ? `${options.gap}px`
                : `${options.rowGap}px ${options.columnGap}px`,
            }}
          >
            {Array.from({ length: cellCount }, (_, i) => (
              <div
                key={i}
                className={`${CELL_COLORS[i % CELL_COLORS.length]} text-white font-bold rounded flex items-center justify-center text-sm`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated CSS
          </label>
          <CopyButton text={css} />
        </div>
        <textarea
          readOnly
          value={css}
          className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
