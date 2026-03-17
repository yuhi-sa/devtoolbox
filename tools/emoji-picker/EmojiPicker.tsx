"use client";

import { useState } from "react";
import { searchEmojis, getCategories, EmojiEntry } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function EmojiPicker() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<EmojiEntry | null>(null);

  const categories = ["All", ...getCategories()];
  const results = searchEmojis(query, category);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search emojis..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Emoji Info */}
      {selected && (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 flex items-center gap-4">
          <span className="text-5xl">{selected.emoji}</span>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {selected.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selected.category}
            </div>
            <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
              {selected.codePoint}
            </div>
          </div>
          <CopyButton text={selected.emoji} />
        </div>
      )}

      {/* Emoji Grid */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {results.length} emojis found
      </div>
      <div className="grid grid-cols-8 md:grid-cols-12 gap-1">
        {results.map((entry, i) => (
          <button
            key={`${entry.codePoint}-${i}`}
            onClick={() => setSelected(entry)}
            title={entry.name}
            className={`text-2xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              selected?.codePoint === entry.codePoint
                ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                : ""
            }`}
          >
            {entry.emoji}
          </button>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No emojis found matching your search.
        </div>
      )}
    </div>
  );
}
