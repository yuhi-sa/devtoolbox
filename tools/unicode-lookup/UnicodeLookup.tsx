"use client";

import { useState } from "react";
import {
  lookupCharacter,
  searchByName,
  parseCodePoint,
  CharacterInfo,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function UnicodeLookup() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CharacterInfo[]>([]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    // Try as code point (U+XXXX)
    const fromCodePoint = parseCodePoint(trimmed);
    if (fromCodePoint) {
      setResults([lookupCharacter(fromCodePoint)]);
      return;
    }

    // Single character lookup
    if ([...trimmed].length === 1) {
      setResults([lookupCharacter(trimmed)]);
      return;
    }

    // Search by name
    setResults(searchByName(trimmed));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter character, U+XXXX, or search by name (e.g. ARROW)"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg dark:border-gray-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                <th className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  Char
                </th>
                <th className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  Code Point
                </th>
                <th className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  UTF-8
                </th>
                <th className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  HTML
                </th>
                <th className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((info, i) => (
                <tr
                  key={i}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-3 py-2 text-2xl">{info.character}</td>
                  <td className="px-3 py-2 font-mono text-gray-600 dark:text-gray-400">
                    {info.codePoint}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-600 dark:text-gray-400">
                    {info.utf8Hex}
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-600 dark:text-gray-400">
                    {info.htmlEntity}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                    {info.name}
                  </td>
                  <td className="px-3 py-2">
                    <CopyButton text={info.character} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results.length === 0 && query && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No results found. Try a character, code point (U+0041), or name
          search.
        </div>
      )}
    </div>
  );
}
