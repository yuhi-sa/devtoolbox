"use client";

import { useState } from "react";
import { searchStatusCodes } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function HttpStatusReference() {
  const [query, setQuery] = useState("");

  const results = searchStatusCodes(query);
  const resultText = results.map((s) => `${s.code} ${s.name}: ${s.description}`).join("\n");

  const categoryColors: Record<string, string> = {
    "1xx Informational": "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    "2xx Success": "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    "3xx Redirection": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    "4xx Client Error": "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
    "5xx Server Error": "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search by code, name, or description..."
          />
        </div>
        <CopyButton text={resultText} />
      </div>

      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {results.map((status) => (
          <div
            key={status.code}
            className={`p-3 rounded-lg ${categoryColors[status.category] || "bg-gray-100 dark:bg-gray-800"}`}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-lg">{status.code}</span>
              <span className="font-medium">{status.name}</span>
            </div>
            <p className="text-sm mt-1 opacity-80">{status.description}</p>
          </div>
        ))}
        {results.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No matching status codes found.
          </p>
        )}
      </div>
    </div>
  );
}
