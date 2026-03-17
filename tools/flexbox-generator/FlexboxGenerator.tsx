"use client";

import { useState } from "react";
import {
  FlexboxOptions,
  defaultFlexboxOptions,
  generateFlexboxCSS,
  FLEX_DIRECTIONS,
  JUSTIFY_CONTENTS,
  ALIGN_ITEMS_OPTIONS,
  FLEX_WRAPS,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
} from "./logic";
import CopyButton from "@/components/CopyButton";

const ITEM_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function FlexboxGenerator() {
  const [options, setOptions] = useState<FlexboxOptions>(defaultFlexboxOptions);
  const [itemCount, setItemCount] = useState(4);

  const update = <K extends keyof FlexboxOptions>(key: K, value: FlexboxOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const css = generateFlexboxCSS(options);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Direction:
          <select
            value={options.direction}
            onChange={(e) => update("direction", e.target.value as FlexDirection)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {FLEX_DIRECTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Justify:
          <select
            value={options.justifyContent}
            onChange={(e) => update("justifyContent", e.target.value as JustifyContent)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {JUSTIFY_CONTENTS.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Align:
          <select
            value={options.alignItems}
            onChange={(e) => update("alignItems", e.target.value as AlignItems)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {ALIGN_ITEMS_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Wrap:
          <select
            value={options.flexWrap}
            onChange={(e) => update("flexWrap", e.target.value as FlexWrap)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {FLEX_WRAPS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
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

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Items:
          <input
            type="number"
            min={1}
            max={12}
            value={itemCount}
            onChange={(e) => setItemCount(Math.max(1, Math.min(12, Number(e.target.value))))}
            className="w-16 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Preview
        </label>
        <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 min-h-[200px]">
          <div
            style={{
              display: "flex",
              flexDirection: options.direction,
              justifyContent: options.justifyContent,
              alignItems: options.alignItems,
              flexWrap: options.flexWrap,
              gap: `${options.gap}px`,
              minHeight: "180px",
            }}
          >
            {Array.from({ length: itemCount }, (_, i) => (
              <div
                key={i}
                className={`${ITEM_COLORS[i % ITEM_COLORS.length]} text-white font-bold rounded flex items-center justify-center`}
                style={{
                  width: 60 + (i % 3) * 10,
                  height: 40 + (i % 2) * 20,
                  minWidth: 40,
                  minHeight: 30,
                }}
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
