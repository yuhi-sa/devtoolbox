"use client";

import { useState } from "react";
import {
  generateEslintConfig,
  getDefaultOptions,
  Framework,
  Style,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function EslintConfig() {
  const [options, setOptions] = useState(getDefaultOptions());
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    setOutput(generateEslintConfig(options));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Framework */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Framework:
          <select
            value={options.framework}
            onChange={(e) =>
              setOptions({ ...options, framework: e.target.value as Framework })
            }
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="node">Node.js</option>
          </select>
        </label>

        {/* Style */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Style:
          <select
            value={options.style}
            onChange={(e) =>
              setOptions({ ...options, style: e.target.value as Style })
            }
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="airbnb">Airbnb</option>
            <option value="standard">Standard</option>
          </select>
        </label>
      </div>

      {/* Toggles */}
      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={options.typescript}
            onChange={(e) =>
              setOptions({ ...options, typescript: e.target.checked })
            }
            className="rounded"
          />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={options.plugins.prettier}
            onChange={(e) =>
              setOptions({
                ...options,
                plugins: { ...options.plugins, prettier: e.target.checked },
              })
            }
            className="rounded"
          />
          Prettier
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={options.plugins.importPlugin}
            onChange={(e) =>
              setOptions({
                ...options,
                plugins: { ...options.plugins, importPlugin: e.target.checked },
              })
            }
            className="rounded"
          />
          Import
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={options.plugins.unusedImports}
            onChange={(e) =>
              setOptions({
                ...options,
                plugins: { ...options.plugins, unusedImports: e.target.checked },
              })
            }
            className="rounded"
          />
          Unused Imports
        </label>
        {options.framework === "react" && (
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={options.plugins.a11y}
              onChange={(e) =>
                setOptions({
                  ...options,
                  plugins: { ...options.plugins, a11y: e.target.checked },
                })
              }
              className="rounded"
            />
            JSX A11y
          </label>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Config
        </button>
        {output && <CopyButton text={output} />}
      </div>

      {output && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            eslint.config.js
          </label>
          <textarea
            readOnly
            value={output}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      )}
    </div>
  );
}
