"use client";

import { useState } from "react";
import { generateLorem, GenerateMode } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function LoremGenerator() {
  const [mode, setMode] = useState<GenerateMode>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    setOutput(generateLorem(mode, count, startWithLorem));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as GenerateMode)}
            className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Count
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-20 p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 pb-1">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
          />
          Start with &quot;Lorem ipsum...&quot;
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
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
