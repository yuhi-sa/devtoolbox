"use client";

import { useState } from "react";
import { convertAllCases, CaseConversions } from "./logic";
import CopyButton from "@/components/CopyButton";

const labels: { key: keyof CaseConversions; label: string }[] = [
  { key: "camelCase", label: "camelCase" },
  { key: "pascalCase", label: "PascalCase" },
  { key: "snakeCase", label: "snake_case" },
  { key: "screamingSnakeCase", label: "SCREAMING_SNAKE_CASE" },
  { key: "kebabCase", label: "kebab-case" },
  { key: "titleCase", label: "Title Case" },
  { key: "upperCase", label: "UPPER CASE" },
  { key: "lowerCase", label: "lower case" },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");

  const conversions = input.trim() ? convertAllCases(input) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="hello world, helloWorld, hello_world, etc."
        />
      </div>

      {conversions && (
        <div className="space-y-2">
          {labels.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-48 shrink-0">
                {label}
              </span>
              <code className="flex-1 font-mono text-sm text-gray-900 dark:text-gray-100 truncate">
                {conversions[key]}
              </code>
              <CopyButton text={conversions[key]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
