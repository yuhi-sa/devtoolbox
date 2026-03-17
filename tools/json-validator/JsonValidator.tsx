"use client";

import { useState } from "react";
import { validateJson, formatJson, ValidationResult } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    setResult(validateJson(input));
  };

  const handleFormat = () => {
    try {
      setInput(formatJson(input));
      setResult(validateJson(formatJson(input)));
    } catch {
      setResult(validateJson(input));
    }
  };

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
          placeholder='{"key": "value"}'
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Validate
        </button>
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Format
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Status */}
          <div
            className={`p-3 rounded-lg border ${
              result.valid
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
          >
            <span
              className={`font-bold ${
                result.valid
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {result.valid ? "Valid JSON" : "Invalid JSON"}
            </span>
          </div>

          {/* Error Details */}
          {result.error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded space-y-1">
              <div className="font-mono">{result.error.message}</div>
              {result.error.line && (
                <div>
                  Line {result.error.line}
                  {result.error.column && `, Column ${result.error.column}`}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          {result.stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Keys
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {result.stats.keyCount}
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Depth
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {result.stats.depth}
                </div>
              </div>
              <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Nodes
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {result.stats.nodeCount}
                </div>
              </div>
            </div>
          )}

          {/* Key Paths */}
          {result.keyPaths && result.keyPaths.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Paths ({result.keyPaths.length})
                </h3>
                <CopyButton
                  text={result.keyPaths.join("\n")}
                  label="Copy Paths"
                />
              </div>
              <div className="max-h-48 overflow-y-auto p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
                {result.keyPaths.map((path, i) => (
                  <div
                    key={i}
                    className="text-gray-700 dark:text-gray-300 py-0.5"
                  >
                    {path}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
