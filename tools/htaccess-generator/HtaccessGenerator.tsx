"use client";

import { useState } from "react";
import { generateHtaccess, getDefaultOptions } from "./logic";
import type { HtaccessOptions } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function HtaccessGenerator() {
  const [options, setOptions] = useState<HtaccessOptions>(getDefaultOptions());
  const output = generateHtaccess(options);

  const update = (partial: Partial<HtaccessOptions>) =>
    setOptions((prev) => ({ ...prev, ...partial }));

  const addRedirect = () =>
    update({ redirects: [...options.redirects, { from: "", to: "", type: "301" }] });

  const removeRedirect = (i: number) =>
    update({ redirects: options.redirects.filter((_, idx) => idx !== i) });

  const updateRedirect = (i: number, field: string, value: string) =>
    update({
      redirects: options.redirects.map((r, idx) =>
        idx === i ? { ...r, [field]: value } : r
      ),
    });

  const addErrorPage = () =>
    update({ errorPages: [...options.errorPages, { code: "404", page: "/404.html" }] });

  const removeErrorPage = (i: number) =>
    update({ errorPages: options.errorPages.filter((_, idx) => idx !== i) });

  const updateErrorPage = (i: number, field: string, value: string) =>
    update({
      errorPages: options.errorPages.map((e, idx) =>
        idx === i ? { ...e, [field]: value } : e
      ),
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* HTTPS */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.forceHttps}
              onChange={(e) => update({ forceHttps: e.target.checked })}
            />
            Force HTTPS
          </label>

          {/* WWW */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              WWW Preference
            </label>
            <select
              value={options.forceWww}
              onChange={(e) => update({ forceWww: e.target.value as HtaccessOptions["forceWww"] })}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="none">No preference</option>
              <option value="www">Force www</option>
              <option value="non-www">Force non-www</option>
            </select>
          </div>

          {/* Redirects */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Redirects
              </label>
              <button
                onClick={addRedirect}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            {options.redirects.map((r, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <select
                  value={r.type}
                  onChange={(e) => updateRedirect(i, "type", e.target.value)}
                  className="p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="301">301</option>
                  <option value="302">302</option>
                </select>
                <input
                  value={r.from}
                  onChange={(e) => updateRedirect(i, "from", e.target.value)}
                  placeholder="/old-path"
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <input
                  value={r.to}
                  onChange={(e) => updateRedirect(i, "to", e.target.value)}
                  placeholder="/new-path"
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <button
                  onClick={() => removeRedirect(i)}
                  className="px-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          {/* Error Pages */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Error Pages
              </label>
              <button
                onClick={addErrorPage}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            {options.errorPages.map((e, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input
                  value={e.code}
                  onChange={(ev) => updateErrorPage(i, "code", ev.target.value)}
                  placeholder="404"
                  className="w-20 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <input
                  value={e.page}
                  onChange={(ev) => updateErrorPage(i, "page", ev.target.value)}
                  placeholder="/404.html"
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <button
                  onClick={() => removeErrorPage(i)}
                  className="px-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          {/* CORS */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.enableCors}
              onChange={(e) => update({ enableCors: e.target.checked })}
            />
            Enable CORS Headers
          </label>
          {options.enableCors && (
            <input
              value={options.corsOrigin}
              onChange={(e) => update({ corsOrigin: e.target.value })}
              placeholder="* or https://example.com"
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}

          {/* Caching */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.enableCaching}
              onChange={(e) => update({ enableCaching: e.target.checked })}
            />
            Enable Browser Caching
          </label>
          {options.enableCaching && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Days:</label>
              <input
                type="number"
                min={1}
                value={options.cacheDays}
                onChange={(e) => update({ cacheDays: parseInt(e.target.value) || 30 })}
                className="w-20 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Gzip */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.enableGzip}
              onChange={(e) => update({ enableGzip: e.target.checked })}
            />
            Enable Gzip Compression
          </label>

          {/* Deny dot files */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.denyDotFiles}
              onChange={(e) => update({ denyDotFiles: e.target.checked })}
            />
            Deny Access to Dot Files
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated .htaccess
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
