"use client";

import { useState, useMemo } from "react";
import { buildAsciiTable, filterAsciiTable } from "./logic";

export default function AsciiTable() {
  const [query, setQuery] = useState("");
  const fullTable = useMemo(() => buildAsciiTable(), []);
  const filtered = useMemo(
    () => filterAsciiTable(fullTable, query),
    [fullTable, query]
  );

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by character, decimal, hex, or description..."
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filtered.length} of 128 entries
      </div>

      <div className="overflow-x-auto rounded-lg border dark:border-gray-600">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Dec
              </th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Hex
              </th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Oct
              </th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Binary
              </th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Char
              </th>
              <th className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr
                key={entry.decimal}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-3 py-1.5 font-mono">{entry.decimal}</td>
                <td className="px-3 py-1.5 font-mono">0x{entry.hex}</td>
                <td className="px-3 py-1.5 font-mono">{entry.octal}</td>
                <td className="px-3 py-1.5 font-mono">{entry.binary}</td>
                <td className="px-3 py-1.5 font-mono text-blue-600 dark:text-blue-400">
                  {entry.character || (
                    <span className="text-gray-400 dark:text-gray-600 italic">
                      N/A
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-gray-600 dark:text-gray-400">
                  {entry.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
