"use client";

import { useState } from "react";
import { markdownToHtml, htmlToMarkdown } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function MarkdownHtml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleToHtml = () => {
    try {
      setError("");
      setOutput(markdownToHtml(input));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleToMarkdown = () => {
    try {
      setError("");
      setOutput(htmlToMarkdown(input));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleToHtml}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Markdown → HTML
        </button>
        <button
          onClick={handleToMarkdown}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          HTML → Markdown
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          {showPreview ? "Show HTML" : "Show Preview"}
        </button>
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
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter Markdown or HTML..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {showPreview ? "Preview" : "Output"}
            </label>
            <CopyButton text={output} />
          </div>
          {showPreview ? (
            <div
              className="w-full h-60 p-3 text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 overflow-auto prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <textarea
              readOnly
              value={output}
              className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
            />
          )}
        </div>
      </div>
    </div>
  );
}
