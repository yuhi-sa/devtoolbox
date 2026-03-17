"use client";

import { useState } from "react";
import { searchColors, formatRgb } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function HtmlColors() {
  const [query, setQuery] = useState("");
  const colors = searchColors(query);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Search Colors
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, hex, or rgb..."
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {colors.length} colors
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {colors.map((color) => (
          <div
            key={color.name}
            className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div
              className="w-full h-12 rounded mb-2 border dark:border-gray-600"
              style={{ backgroundColor: color.hex }}
            />
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {color.name}
                </span>
                <CopyButton text={color.name} label="Copy" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {color.hex}
                </span>
                <CopyButton text={color.hex} label="Hex" />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {formatRgb(color.rgb)}
                </span>
                <CopyButton text={formatRgb(color.rgb)} label="RGB" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
