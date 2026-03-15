"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools-registry";
import { toolTranslations } from "@/lib/i18n";
import ToolCard from "@/components/ToolCard";

export default function EnglishHome() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favs);

    const handler = () => {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(favs);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const sortedTools = useMemo(() => {
    let list = [...tools];
    if (filter) {
      list = list.filter((t) => {
        const en = toolTranslations[t.id];
        const name = en?.name || t.name;
        const desc = en?.description || t.description;
        return (
          name.toLowerCase().includes(filter.toLowerCase()) ||
          desc.toLowerCase().includes(filter.toLowerCase()) ||
          t.category.toLowerCase().includes(filter.toLowerCase())
        );
      });
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
  }, [filter, favorites]);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Developer Tools</h1>
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            🇯🇵 日本語版
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTools.map((tool) => {
          const en = toolTranslations[tool.id];
          const enTool = en
            ? { ...tool, name: en.name, description: en.description }
            : tool;
          return (
            <ToolCard key={tool.id} tool={enTool} linkPrefix="/en/tools" />
          );
        })}
      </div>
    </div>
  );
}
