"use client";

import { useState } from "react";
import { optimizeSvg, getSvgStats } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function SvgViewer() {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");

  const inputStats = input ? getSvgStats(input) : null;
  const optimizedStats = optimized ? getSvgStats(optimized) : null;

  const handleOptimize = () => {
    const result = optimizeSvg(input);
    setOptimized(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleOptimize}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Optimize
        </button>
      </div>

      {inputStats && (
        <div className="text-sm text-gray-600 dark:text-gray-400 flex gap-4 flex-wrap">
          <span>Original: {inputStats.size} bytes</span>
          <span>Elements: {inputStats.elements}</span>
          {inputStats.viewBox && <span>viewBox: {inputStats.viewBox}</span>}
          {optimizedStats && (
            <span className="text-green-600 dark:text-green-400">
              Optimized: {optimizedStats.size} bytes (
              {Math.round((1 - optimizedStats.size / inputStats.size) * 100)}%
              smaller)
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            SVG Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>'
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Optimized
            </label>
            <CopyButton text={optimized} />
          </div>
          <textarea
            readOnly
            value={optimized}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>

      {input && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-600 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: optimized || input }}
          />
        </div>
      )}
    </div>
  );
}
