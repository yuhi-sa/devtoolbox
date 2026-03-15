"use client";

import { useState } from "react";
import { jsonToTs, validateJsonInput } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JsonToTs() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [useInterface, setUseInterface] = useState(true);
  const [error, setError] = useState("");

  const handleConvert = () => {
    const v = validateJsonInput(input);
    if (!v.valid) {
      setError(v.error || "Invalid JSON");
      setOutput("");
      return;
    }
    setError("");
    setOutput(jsonToTs(input, { rootName, useInterface }));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Types
        </button>
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Root name:
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="border rounded px-2 py-1 w-32 bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={useInterface}
            onChange={(e) => setUseInterface(e.target.checked)}
            className="rounded"
          />
          Use interface (vs type)
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
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder='{"name": "John", "age": 30}'
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              TypeScript Output
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
