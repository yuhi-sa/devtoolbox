"use client";

import { useState } from "react";
import { escape, unescape, EscapeMode } from "./logic";
import CopyButton from "@/components/CopyButton";

const modes: { value: EscapeMode; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "url", label: "URL" },
  { value: "unicode", label: "Unicode" },
  { value: "backslash", label: "Backslash" },
];

export default function StringEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("json");
  const [error, setError] = useState("");

  const handleEscape = () => {
    try {
      setError("");
      setOutput(escape(input, mode));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleUnescape = () => {
    try {
      setError("");
      setOutput(unescape(input, mode));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleEscape}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Escape
        </button>
        <button
          onClick={handleUnescape}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Unescape
        </button>
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Mode:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as EscapeMode)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {modes.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter text to escape or unescape..."
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
            className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
