"use client";

import { useState } from "react";
import {
  generateTsconfig,
  getDefaultOptions,
  TARGET_OPTIONS,
  MODULE_OPTIONS,
  MODULE_RESOLUTION_OPTIONS,
  JSX_OPTIONS,
  LIB_OPTIONS,
} from "./logic";
import type { TsconfigOptions } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function TsconfigGenerator() {
  const [options, setOptions] = useState<TsconfigOptions>(getDefaultOptions());
  const output = generateTsconfig(options);

  const update = (partial: Partial<TsconfigOptions>) =>
    setOptions((prev) => ({ ...prev, ...partial }));

  const toggleLib = (lib: string) => {
    update({
      lib: options.lib.includes(lib)
        ? options.lib.filter((l) => l !== lib)
        : [...options.lib, lib],
    });
  };

  const addPath = () =>
    update({ paths: [...options.paths, { alias: "", path: "" }] });

  const removePath = (i: number) =>
    update({ paths: options.paths.filter((_, idx) => idx !== i) });

  const updatePath = (i: number, field: "alias" | "path", value: string) =>
    update({
      paths: options.paths.map((p, idx) =>
        idx === i ? { ...p, [field]: value } : p
      ),
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {/* Target & Module */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Target
              </label>
              <select
                value={options.target}
                onChange={(e) => update({ target: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {TARGET_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Module
              </label>
              <select
                value={options.module}
                onChange={(e) => update({ module: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {MODULE_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Module Resolution
              </label>
              <select
                value={options.moduleResolution}
                onChange={(e) => update({ moduleResolution: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {MODULE_RESOLUTION_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                JSX
              </label>
              <select
                value={options.jsx}
                onChange={(e) => update({ jsx: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {JSX_OPTIONS.map((j) => (
                  <option key={j} value={j}>
                    {j || "(none)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lib */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Lib
            </label>
            <div className="flex flex-wrap gap-2">
              {LIB_OPTIONS.map((lib) => (
                <label
                  key={lib}
                  className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={options.lib.includes(lib)}
                    onChange={() => toggleLib(lib)}
                  />
                  {lib}
                </label>
              ))}
            </div>
          </div>

          {/* Strict options */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Strict Mode
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(
                [
                  ["strict", "strict"],
                  ["strictNullChecks", "strictNullChecks"],
                  ["strictFunctionTypes", "strictFunctionTypes"],
                  ["strictBindCallApply", "strictBindCallApply"],
                  ["strictPropertyInitialization", "strictPropertyInit"],
                  ["noImplicitAny", "noImplicitAny"],
                  ["noImplicitReturns", "noImplicitReturns"],
                  ["noImplicitThis", "noImplicitThis"],
                  ["noUnusedLocals", "noUnusedLocals"],
                  ["noUnusedParameters", "noUnusedParameters"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={options[key] as boolean}
                    onChange={(e) => update({ [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Other options */}
          <div className="grid grid-cols-2 gap-1">
            {(
              [
                ["esModuleInterop", "esModuleInterop"],
                ["skipLibCheck", "skipLibCheck"],
                ["forceConsistentCasingInFileNames", "forceConsistentCasing"],
                ["resolveJsonModule", "resolveJsonModule"],
                ["declaration", "declaration"],
                ["declarationMap", "declarationMap"],
                ["sourceMap", "sourceMap"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={options[key] as boolean}
                  onChange={(e) => update({ [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>

          {/* Directories */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                outDir
              </label>
              <input
                value={options.outDir}
                onChange={(e) => update({ outDir: e.target.value })}
                className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                rootDir
              </label>
              <input
                value={options.rootDir}
                onChange={(e) => update({ rootDir: e.target.value })}
                className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                baseUrl
              </label>
              <input
                value={options.baseUrl}
                onChange={(e) => update({ baseUrl: e.target.value })}
                className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Paths */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Paths
              </label>
              <button
                onClick={addPath}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            {options.paths.map((p, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <input
                  value={p.alias}
                  onChange={(e) => updatePath(i, "alias", e.target.value)}
                  placeholder="@/*"
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <input
                  value={p.path}
                  onChange={(e) => updatePath(i, "path", e.target.value)}
                  placeholder="./src/*"
                  className="flex-1 p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                />
                <button
                  onClick={() => removePath(i)}
                  className="px-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          {/* Include / Exclude */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                Include (comma-separated)
              </label>
              <input
                value={options.include.join(", ")}
                onChange={(e) =>
                  update({
                    include: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400">
                Exclude (comma-separated)
              </label>
              <input
                value={options.exclude.join(", ")}
                onChange={(e) =>
                  update({
                    exclude: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated tsconfig.json
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
