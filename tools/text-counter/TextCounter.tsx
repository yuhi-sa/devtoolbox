"use client";

import { useState } from "react";
import { countTextStats, formatReadingTime } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function TextCounter() {
  const [input, setInput] = useState("");

  const stats = countTextStats(input);

  const statItems = [
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Bytes", value: stats.bytes },
    { label: "Unique Words", value: stats.uniqueWords },
    { label: "Reading Time", value: formatReadingTime(stats.readingTimeSeconds) },
  ];

  const summaryText = statItems
    .map((s) => `${s.label}: ${s.value}`)
    .join("\n");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type or paste text here..."
        />
      </div>

      <div className="flex justify-end">
        <CopyButton text={summaryText} label="Copy Stats" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statItems.map(({ label, value }) => (
          <div
            key={label}
            className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {label}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
