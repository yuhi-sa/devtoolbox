"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ToolDefinition } from "@/lib/types";

interface ToolCardProps {
  tool: ToolDefinition;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favs.includes(tool.id));
  }, [tool.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const newFavs = isFavorite
      ? favs.filter((f) => f !== tool.id)
      : [...favs, tool.id];
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const href =
    tool.id === "pipeline" ? "/pipeline" : `/tools/${tool.id}`;

  const card = (
    <div
      className={`group relative p-4 border dark:border-gray-700 rounded-xl transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 ${
        !tool.implemented ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400 transition"
        aria-label="Toggle favorite"
      >
        {isFavorite ? (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </button>
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">
        {tool.icon}
      </div>
      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
        {tool.name}
        {!tool.implemented && (
          <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
            Coming Soon
          </span>
        )}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {tool.description}
      </p>
      <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
        {tool.category}
      </span>
    </div>
  );

  if (!tool.implemented) {
    return card;
  }

  return <Link href={href}>{card}</Link>;
}
