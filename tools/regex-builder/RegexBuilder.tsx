"use client";

import { useState } from "react";
import {
  buildRegex,
  describeRegex,
  getAvailablePatterns,
} from "./logic";
import type { RegexPart, RegexFlags } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function RegexBuilder() {
  const [parts, setParts] = useState<RegexPart[]>([]);
  const [flags, setFlags] = useState<RegexFlags>({
    global: false,
    caseInsensitive: false,
    multiline: false,
  });
  const [testText, setTestText] = useState("");

  const availablePatterns = getAvailablePatterns();

  const addPart = (type: string) => {
    setParts([...parts, { type, quantifier: "", value: "" }]);
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index: number, updates: Partial<RegexPart>) => {
    const next = parts.map((p, i) =>
      i === index ? { ...p, ...updates } : p
    );
    setParts(next);
  };

  const regex = parts.length > 0 ? buildRegex(parts, flags) : "";
  const description = parts.length > 0 ? describeRegex(parts) : "";

  const getMatches = (): string[] => {
    if (!regex || !testText) return [];
    try {
      const patternMatch = regex.match(/^\/(.+)\/([gimsuy]*)$/);
      if (!patternMatch) return [];
      const re = new RegExp(patternMatch[1], patternMatch[2]);
      const matches = testText.match(re);
      return matches ? Array.from(matches) : [];
    } catch {
      return [];
    }
  };

  const matches = getMatches();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Add Pattern Parts
        </h3>
        <div className="flex flex-wrap gap-2">
          {availablePatterns.map((p) => (
            <button
              key={p.type}
              onClick={() => addPart(p.type)}
              className="px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {parts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pattern Parts
          </h3>
          {parts.map((part, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-600"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-6">
                {i + 1}.
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {availablePatterns.find((p) => p.type === part.type)?.label ||
                  part.type}
              </span>
              {part.type === "custom" && (
                <input
                  type="text"
                  value={part.value || ""}
                  onChange={(e) => updatePart(i, { value: e.target.value })}
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-700 dark:border-gray-600 font-mono"
                  placeholder="Custom regex pattern"
                />
              )}
              <select
                value={part.quantifier || ""}
                onChange={(e) =>
                  updatePart(i, {
                    quantifier: e.target.value as RegexPart["quantifier"],
                  })
                }
                className="p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="">Exact</option>
                <option value="?">? (optional)</option>
                <option value="+">+ (one or more)</option>
                <option value="*">* (zero or more)</option>
              </select>
              <button
                onClick={() => removePart(i)}
                className="px-2 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Flags
        </h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={flags.global}
              onChange={(e) =>
                setFlags({ ...flags, global: e.target.checked })
              }
            />
            Global (g)
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={flags.caseInsensitive}
              onChange={(e) =>
                setFlags({ ...flags, caseInsensitive: e.target.checked })
              }
            />
            Case Insensitive (i)
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={flags.multiline}
              onChange={(e) =>
                setFlags({ ...flags, multiline: e.target.checked })
              }
            />
            Multiline (m)
          </label>
        </div>
      </div>

      {regex && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Built Regex
            </label>
            <CopyButton text={regex} />
          </div>
          <div className="p-3 font-mono text-lg border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
            {regex}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Test Text
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full h-24 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter text to test the regex against..."
        />
      </div>

      {testText && regex && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Matches ({matches.length})
          </h3>
          {matches.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matches.map((m, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-sm font-mono bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
}
