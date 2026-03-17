"use client";

import { useState } from "react";
import { analyzeJsonSize, formatBytes, JsonSizeAnalysis } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JsonSize() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JsonSizeAnalysis | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    try {
      setError("");
      setResult(analyzeJsonSize(input));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const summaryText = result
    ? [
        `Total Size: ${formatBytes(result.totalSize)}`,
        `Minified: ${formatBytes(result.minifiedSize)}`,
        `Formatted: ${formatBytes(result.formattedSize)}`,
        `Keys: ${result.keyCount}`,
        `Max Depth: ${result.maxDepth}`,
        `Objects: ${result.objectCount}`,
        `Arrays: ${result.arrayCount}`,
        ...Object.entries(result.dataTypes).map(
          ([type, count]) => `${type}: ${count}`
        ),
      ].join("\n")
    : "";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          JSON Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder='{"key": "value", ...}'
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Analyze
        </button>
        {result && <CopyButton text={summaryText} label="Copy Report" />}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Size
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatBytes(result.totalSize)}
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Minified
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatBytes(result.minifiedSize)}
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Formatted
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatBytes(result.formattedSize)}
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Keys
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {result.keyCount}
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Max Depth
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {result.maxDepth}
              </div>
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Objects / Arrays
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {result.objectCount} / {result.arrayCount}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Data Types Breakdown
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.dataTypes).map(([type, count]) => (
                <span
                  key={type}
                  className="px-3 py-1 text-sm border rounded-full bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
