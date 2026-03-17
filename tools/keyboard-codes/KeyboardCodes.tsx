"use client";

import { useState, useEffect, useCallback } from "react";
import { extractKeyInfo, searchCommonKeys, COMMON_KEYS } from "./logic";
import type { KeyInfo } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function KeyboardCodes() {
  const [lastKey, setLastKey] = useState<KeyInfo | null>(null);
  const [query, setQuery] = useState("");
  const filteredKeys = searchCommonKeys(query);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setLastKey(extractKeyInfo(e));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-600 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Press any key to see its event properties
        </p>
        {lastKey ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">event.key</div>
              <div className="font-mono text-lg text-gray-700 dark:text-gray-300">
                {lastKey.key === " " ? "\" \"" : lastKey.key}
              </div>
              <CopyButton text={lastKey.key} label="Copy" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">event.code</div>
              <div className="font-mono text-lg text-gray-700 dark:text-gray-300">
                {lastKey.code}
              </div>
              <CopyButton text={lastKey.code} label="Copy" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">event.keyCode</div>
              <div className="font-mono text-lg text-gray-700 dark:text-gray-300">
                {lastKey.keyCode}
              </div>
              <CopyButton text={String(lastKey.keyCode)} label="Copy" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">event.which</div>
              <div className="font-mono text-lg text-gray-700 dark:text-gray-300">
                {lastKey.which}
              </div>
              <CopyButton text={String(lastKey.which)} label="Copy" />
            </div>
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-lg">
            Waiting for key press...
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Search Common Keys
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by key name, code, or keyCode..."
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">Key</th>
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">event.key</th>
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">event.code</th>
              <th className="text-left p-2 text-gray-700 dark:text-gray-300">keyCode</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((k, i) => (
              <tr
                key={`${k.code}-${i}`}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2 text-gray-700 dark:text-gray-300">{k.label}</td>
                <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                  {k.key === " " ? "\" \"" : k.key}
                </td>
                <td className="p-2 font-mono text-gray-700 dark:text-gray-300">{k.code}</td>
                <td className="p-2 font-mono text-gray-700 dark:text-gray-300">{k.keyCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
