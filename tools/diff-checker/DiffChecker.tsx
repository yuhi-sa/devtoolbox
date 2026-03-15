"use client";

import { useState } from "react";
import { computeDiff } from "./logic";

export default function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<ReturnType<typeof computeDiff> | null>(null);

  const handleCompare = () => {
    setDiff(computeDiff(textA, textB));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Original
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full h-48 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Original text..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Modified
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full h-48 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Modified text..."
          />
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Compare
      </button>

      {diff && (
        <div className="border rounded-lg overflow-hidden dark:border-gray-600">
          <div className="p-3 font-mono text-sm bg-gray-50 dark:bg-gray-900 space-y-0">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 ${
                  line.type === "added"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : line.type === "removed"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="select-none mr-2 text-gray-400">
                  {line.type === "added"
                    ? "+"
                    : line.type === "removed"
                    ? "-"
                    : " "}
                </span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
