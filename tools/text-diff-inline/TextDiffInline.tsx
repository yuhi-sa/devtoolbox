"use client";

import { useState } from "react";
import { computeInlineDiff, InlineDiffLine, InlineSegment } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function TextDiffInline() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diffResult, setDiffResult] = useState<InlineDiffLine[]>([]);
  const [hasDiffed, setHasDiffed] = useState(false);

  const handleDiff = () => {
    setDiffResult(computeInlineDiff(textA, textB));
    setHasDiffed(true);
  };

  const renderSegment = (seg: InlineSegment, idx: number) => {
    switch (seg.type) {
      case "added":
        return (
          <span
            key={idx}
            className="bg-green-200 dark:bg-green-800/50 text-green-900 dark:text-green-200"
          >
            {seg.text}
          </span>
        );
      case "removed":
        return (
          <span
            key={idx}
            className="bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-200 line-through"
          >
            {seg.text}
          </span>
        );
      default:
        return <span key={idx}>{seg.text}</span>;
    }
  };

  const getLineBg = (type: InlineDiffLine["type"]) => {
    switch (type) {
      case "added":
        return "bg-green-50 dark:bg-green-900/10";
      case "removed":
        return "bg-red-50 dark:bg-red-900/10";
      case "modified":
        return "bg-yellow-50 dark:bg-yellow-900/10";
      default:
        return "";
    }
  };

  const outputText = diffResult
    .map((line) => line.segments.map((s) => s.text).join(""))
    .join("\n");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Original Text
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter original text..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Modified Text
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter modified text..."
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDiff}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Compare
        </button>
        {hasDiffed && <CopyButton text={outputText} />}
      </div>

      {hasDiffed && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Inline Diff Result
          </label>
          <div className="border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-600 overflow-auto max-h-96 font-mono text-sm">
            {diffResult.map((line) => (
              <div
                key={line.lineNumber}
                className={`flex ${getLineBg(line.type)}`}
              >
                <span className="w-12 shrink-0 text-right pr-3 py-0.5 text-gray-400 dark:text-gray-500 select-none border-r dark:border-gray-700">
                  {line.lineNumber}
                </span>
                <span className="px-3 py-0.5 whitespace-pre-wrap break-all">
                  {line.segments.map(renderSegment)}
                  {line.segments.every((s) => s.text === "") && "\u00A0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
