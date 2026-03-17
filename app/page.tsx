"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { tools } from "@/application/registry";
import ToolCard from "@/components/ToolCard";

const ALL_CATEGORY = "All";
const FAVORITES_CATEGORY = "Favorites";
const RECENT_CATEGORY = "Recent";

const categories = [
  ALL_CATEGORY,
  FAVORITES_CATEGORY,
  RECENT_CATEGORY,
  ...Array.from(new Set(tools.map((t) => t.category))).sort(),
];

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem("recentTools") || "[]");
  } catch {
    return [];
  }
}

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  useEffect(() => {
    setFavorites(getFavorites());
    setRecent(getRecent());

    const handler = () => {
      setFavorites(getFavorites());
      setRecent(getRecent());
    };
    window.addEventListener("storage", handler);
    window.addEventListener("favorites-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("favorites-changed", handler);
    };
  }, []);

  const onFavoriteToggle = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const sortedTools = useMemo(() => {
    let list = [...tools];

    // Filter by search text
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory === FAVORITES_CATEGORY) {
      list = list.filter((t) => favorites.includes(t.id));
    } else if (selectedCategory === RECENT_CATEGORY) {
      list = list.filter((t) => recent.includes(t.id));
      // Sort by recency
      list.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
      return list;
    } else if (selectedCategory !== ALL_CATEGORY) {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Favorites first, then implemented, then coming soon
    list.sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 0 : 1;
      const bFav = favorites.includes(b.id) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      const aImpl = a.implemented ? 0 : 1;
      const bImpl = b.implemented ? 0 : 1;
      return aImpl - bImpl;
    });
    return list;
  }, [filter, favorites, recent, selectedCategory]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Developer Tools</h1>
          <Link
            href="/en"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            English
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          A collection of useful developer tools. Press{" "}
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
            Cmd+K
          </kbd>{" "}
          to search.
        </p>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md px-4 py-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Filter tools..."
        />

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === ALL_CATEGORY
                ? tools.length
                : cat === FAVORITES_CATEGORY
                  ? favorites.length
                  : cat === RECENT_CATEGORY
                    ? recent.length
                    : tools.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {cat}
                <span className="ml-1 text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {sortedTools.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {selectedCategory === FAVORITES_CATEGORY
            ? "No favorite tools yet. Click the star icon on a tool to add it."
            : selectedCategory === RECENT_CATEGORY
              ? "No recently used tools yet. Open a tool to see it here."
              : "No tools found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
