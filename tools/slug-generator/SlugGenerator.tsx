"use client";

import { useState } from "react";
import { generateSlug, defaultOptions, Separator } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState<Separator>("-");
  const [lowercase, setLowercase] = useState(true);
  const [transliterate, setTransliterate] = useState(true);
  const [maxLength, setMaxLength] = useState(0);

  const slug = generateSlug(input, {
    separator,
    lowercase,
    transliterate,
    maxLength: maxLength > 0 ? maxLength : undefined,
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter text to convert to a slug..."
        />
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Separator:
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as Separator)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
          />
          Lowercase
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={transliterate}
            onChange={(e) => setTransliterate(e.target.checked)}
          />
          Transliterate
        </label>

        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          Max length:
          <input
            type="number"
            min={0}
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
            placeholder="0"
          />
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Slug
          </label>
          <CopyButton text={slug} />
        </div>
        <input
          type="text"
          readOnly
          value={slug}
          className="w-full p-2 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>

      {slug && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Length: {slug.length} characters
        </div>
      )}
    </div>
  );
}
