"use client";

import { useState } from "react";
import { queryJsonPath } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JsonPathTool() {
  const [json, setJson] = useState('{\n  "store": {\n    "books": [\n      {"title": "Book A", "price": 10},\n      {"title": "Book B", "price": 20}\n    ]\n  }\n}');
  const [path, setPath] = useState("$.store.books[0].title");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleQuery = () => {
    const r = queryJsonPath(json, path);
    if (r.error) {
      setError(r.error);
      setResult("");
    } else {
      setError("");
      setResult(r.result);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          JSONPath Expression
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="flex-1 p-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="$.store.books[0].title"
          />
          <button
            onClick={handleQuery}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Query
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            JSON
          </label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-72 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </label>
            <CopyButton text={result} />
          </div>
          <textarea
            readOnly
            value={result}
            className="w-full h-72 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
