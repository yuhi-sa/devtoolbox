"use client";

import { useState } from "react";
import { generateRobotsTxt, RobotRule, RobotsConfig } from "./logic";
import CopyButton from "@/components/CopyButton";

const defaultRule: RobotRule = {
  userAgent: "*",
  allow: [],
  disallow: ["/"],
  crawlDelay: undefined,
};

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<RobotRule[]>([{ ...defaultRule }]);
  const [sitemapUrl, setSitemapUrl] = useState("");

  const config: RobotsConfig = {
    rules,
    sitemapUrl: sitemapUrl || undefined,
  };

  const output = generateRobotsTxt(config);

  const updateRule = (index: number, updates: Partial<RobotRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    setRules(newRules);
  };

  const addRule = () => {
    setRules([...rules, { ...defaultRule }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {rules.map((rule, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 space-y-3 dark:border-gray-600"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rule {i + 1}
            </span>
            {rules.length > 1 && (
              <button
                onClick={() => removeRule(i)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                User-Agent
              </label>
              <select
                value={rule.userAgent}
                onChange={(e) => updateRule(i, { userAgent: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="*">* (All bots)</option>
                <option value="Googlebot">Googlebot</option>
                <option value="Bingbot">Bingbot</option>
                <option value="Slurp">Slurp (Yahoo)</option>
                <option value="DuckDuckBot">DuckDuckBot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Crawl-Delay (seconds)
              </label>
              <input
                type="number"
                min={0}
                value={rule.crawlDelay ?? ""}
                onChange={(e) =>
                  updateRule(i, {
                    crawlDelay: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                placeholder="Optional"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Disallow paths (one per line)
            </label>
            <textarea
              value={rule.disallow.join("\n")}
              onChange={(e) =>
                updateRule(i, {
                  disallow: e.target.value
                    .split("\n")
                    .filter((l) => l.trim() !== ""),
                })
              }
              className="w-full h-20 p-2 font-mono text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              placeholder="/admin"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Allow paths (one per line)
            </label>
            <textarea
              value={rule.allow.join("\n")}
              onChange={(e) =>
                updateRule(i, {
                  allow: e.target.value
                    .split("\n")
                    .filter((l) => l.trim() !== ""),
                })
              }
              className="w-full h-20 p-2 font-mono text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              placeholder="/public"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 items-center flex-wrap">
        <button
          onClick={addRule}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Rule
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Sitemap URL
        </label>
        <input
          type="text"
          value={sitemapUrl}
          onChange={(e) => setSitemapUrl(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
          placeholder="https://example.com/sitemap.xml"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
