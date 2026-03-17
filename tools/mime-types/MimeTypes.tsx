"use client";

import { useState } from "react";
import { searchMimeTypes } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function MimeTypes() {
  const [query, setQuery] = useState("");
  const results = searchMimeTypes(query);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Search MIME Types
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by extension, MIME type, or category..."
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {results.length} entries
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Extension</th>
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">MIME Type</th>
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-right p-2 text-gray-700 dark:text-gray-300">Copy</th>
            </tr>
          </thead>
          <tbody>
            {results.map((entry, i) => (
              <tr
                key={`${entry.extension}-${i}`}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                  {entry.extension}
                </td>
                <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                  {entry.mimeType}
                </td>
                <td className="p-2 text-gray-500 dark:text-gray-400">
                  {entry.category}
                </td>
                <td className="p-2 text-right">
                  <CopyButton text={entry.mimeType} label="Copy" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
