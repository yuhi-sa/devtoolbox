"use client";

import { useState } from "react";
import {
  calculateSpecificity,
  formatSpecificity,
  compareSelectors,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function CssSpecificity() {
  const [selector, setSelector] = useState("");
  const [selectors, setSelectors] = useState("");
  const singleResult = selector.trim()
    ? calculateSpecificity(selector.trim())
    : null;

  const comparisonResults = selectors.trim()
    ? compareSelectors(selectors.split("\n"))
    : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          CSS Selector
        </label>
        <input
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="e.g. div.container #main > p:first-child"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {singleResult && (
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Specificity
              </div>
              <div className="font-mono text-2xl text-gray-700 dark:text-gray-300">
                {formatSpecificity(singleResult)}
              </div>
            </div>
            <CopyButton text={formatSpecificity(singleResult)} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                IDs (a)
              </div>
              <div className="font-mono text-xl text-gray-700 dark:text-gray-300">
                {singleResult.a}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Classes (b)
              </div>
              <div className="font-mono text-xl text-gray-700 dark:text-gray-300">
                {singleResult.b}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Types (c)
              </div>
              <div className="font-mono text-xl text-gray-700 dark:text-gray-300">
                {singleResult.c}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Compare Multiple Selectors (one per line)
        </label>
        <textarea
          value={selectors}
          onChange={(e) => setSelectors(e.target.value)}
          placeholder={"div\n.class\n#id\ndiv.class#id:hover"}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {comparisonResults.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                  Rank
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                  Selector
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                  Specificity
                </th>
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.map((r, i) => (
                <tr
                  key={i}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2 text-gray-700 dark:text-gray-300">
                    {i + 1}
                  </td>
                  <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                    {r.selector}
                  </td>
                  <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                    {formatSpecificity(r.specificity)}
                  </td>
                  <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                    {r.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
