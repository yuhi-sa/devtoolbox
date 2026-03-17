"use client";

import { useState } from "react";
import { convertToAllUnits } from "./logic";
import type { CssUnit } from "./logic";
import CopyButton from "@/components/CopyButton";

const UNITS: CssUnit[] = ["px", "rem", "em", "vw", "vh"];

export default function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<CssUnit>("px");
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [viewportWidth, setViewportWidth] = useState("1920");
  const [viewportHeight, setViewportHeight] = useState("1080");
  const [parentFontSize, setParentFontSize] = useState("16");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      setError("");
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error("Invalid number");
      const results = convertToAllUnits(num, fromUnit, {
        baseFontSize: parseFloat(baseFontSize) || 16,
        viewportWidth: parseFloat(viewportWidth) || 1920,
        viewportHeight: parseFloat(viewportHeight) || 1080,
        parentFontSize: parseFloat(parentFontSize) || 16,
      });
      const lines = UNITS.map(
        (unit) => `${results[unit].toFixed(4).replace(/\.?0+$/, "")}${unit}`
      );
      setOutput(lines.join("\n"));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Base Font Size (px)
          </label>
          <input
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(e.target.value)}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Parent Font Size (px)
          </label>
          <input
            type="number"
            value={parentFontSize}
            onChange={(e) => setParentFontSize(e.target.value)}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Viewport Width (px)
          </label>
          <input
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(e.target.value)}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Viewport Height (px)
          </label>
          <input
            type="number"
            value={viewportHeight}
            onChange={(e) => setViewportHeight(e.target.value)}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-32 p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as CssUnit)}
            className="p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Convert
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Results
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
