"use client";

import { useState } from "react";
import { formatHtml, minifyHtml, getHtmlSizeStats, HtmlSizeStats } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<HtmlSizeStats | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const handleFormat = () => {
    try {
      setError("");
      const result = formatHtml(input, indentSize);
      setOutput(result);
      setStats(getHtmlSizeStats(input, result));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleMinify = () => {
    try {
      setError("");
      const result = minifyHtml(input);
      setOutput(result);
      setStats(getHtmlSizeStats(input, result));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Format
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Minify
        </button>
        <label className="text-sm text-gray-600 dark:text-gray-400 ml-4">
          Indent:
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="ml-1 px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {stats && (
        <div className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded flex gap-4">
          <span>Original: {stats.originalSize} bytes</span>
          <span>Result: {stats.resultSize} bytes</span>
          <span
            className={
              stats.reduction > 0
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500"
            }
          >
            {stats.reduction > 0 ? "Saved" : "Diff"}: {Math.abs(stats.reduction)} bytes (
            {Math.abs(stats.reductionPercent)}%)
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Input HTML
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Paste your HTML here..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
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
    </div>
  );
}
