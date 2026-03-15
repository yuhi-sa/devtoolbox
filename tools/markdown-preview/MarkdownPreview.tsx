"use client";

import { useState, useMemo } from "react";
import { parseMarkdown } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function MarkdownPreview() {
  const [input, setInput] = useState(
    "# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Item 1\n- Item 2\n- Item 3\n\n```js\nconsole.log('hello');\n```\n\n> A blockquote\n\n[Link](https://example.com)"
  );

  const html = useMemo(() => parseMarkdown(input), [input]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Markdown
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter markdown..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <CopyButton text={html} label="Copy HTML" />
          </div>
          <div
            className="w-full h-96 overflow-auto p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
