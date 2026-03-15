"use client";

import { useState } from "react";
import { getTemplates, generateGitignore } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function GitignoreGenerator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const templates = getTemplates();
  const output = selectedIds.length > 0 ? generateGitignore(selectedIds) : "";

  const toggleTemplate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const categories = [
    { key: "language" as const, label: "Languages" },
    { key: "framework" as const, label: "Frameworks" },
    { key: "os" as const, label: "Operating Systems" },
    { key: "editor" as const, label: "Editors / IDEs" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.key}>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {cat.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {templates
                .filter((t) => t.category === cat.key)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleTemplate(t.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                      selectedIds.includes(t.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedIds([])}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Clear All
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated .gitignore
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      )}
    </div>
  );
}
