"use client";

import { useState, useMemo } from "react";
import { testRegex } from "./logic";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const result = useMemo(() => {
    if (!pattern) return null;
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!result || result.error || result.matches.length === 0)
      return testString;

    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;

    const sorted = [...result.matches].sort((a, b) => a.index - b.index);

    for (const m of sorted) {
      if (m.index > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, m.index),
          highlight: false,
        });
      }
      parts.push({ text: m.match, highlight: true });
      lastIndex = m.index + m.match.length;
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), highlight: false });
    }

    return parts;
  }, [result, testString]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Pattern
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full p-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter regex pattern..."
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Flags
          </label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full p-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="gim"
          />
        </div>
      </div>

      {result?.error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {result.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter test string..."
        />
      </div>

      {pattern && testString && !result?.error && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Highlighted Matches
            </label>
            <div className="p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 whitespace-pre-wrap break-all">
              {Array.isArray(highlightedText)
                ? highlightedText.map((part, i) =>
                    part.highlight ? (
                      <mark
                        key={i}
                        className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5"
                      >
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )
                : highlightedText}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Matches ({result?.matches.length || 0})
            </label>
            <div className="space-y-1">
              {result?.matches.map((m, i) => (
                <div
                  key={i}
                  className="p-2 text-sm font-mono border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    [{m.index}]
                  </span>{" "}
                  &quot;{m.match}&quot;
                  {m.groups.length > 0 && (
                    <span className="text-gray-500 ml-2">
                      Groups: {m.groups.map((g) => `"${g}"`).join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
