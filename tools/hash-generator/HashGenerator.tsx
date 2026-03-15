"use client";

import { useState } from "react";
import { generateHash, algorithms, HashAlgorithm } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const handleGenerate = async () => {
    const newResults: Record<string, string> = {};
    for (const algo of algorithms) {
      newResults[algo] = await generateHash(input, algo);
    }
    setResults(newResults);
  };

  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>("SHA-256");
  const [singleResult, setSingleResult] = useState("");

  const handleSingle = async () => {
    const hash = await generateHash(input, selectedAlgo);
    setSingleResult(hash);
    setResults((prev) => ({ ...prev, [selectedAlgo]: hash }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value as HashAlgorithm)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          {algorithms.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button
          onClick={handleSingle}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Generate All
        </button>
      </div>

      {singleResult && (
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={singleResult}
            className="flex-1 p-2 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
          <CopyButton text={singleResult} />
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="space-y-2">
          {algorithms.map(
            (algo) =>
              results[algo] && (
                <div key={algo} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-20 text-gray-700 dark:text-gray-300">
                    {algo}
                  </span>
                  <input
                    readOnly
                    value={results[algo]}
                    className="flex-1 p-2 font-mono text-xs border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                  />
                  <CopyButton text={results[algo]} />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
