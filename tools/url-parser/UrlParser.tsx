"use client";

import { useState } from "react";
import { parseUrl, buildUrl, ParsedUrl } from "./logic";
import CopyButton from "@/components/CopyButton";

const emptyParsed: ParsedUrl = {
  protocol: "https",
  host: "",
  port: "",
  pathname: "/",
  queryParams: [],
  hash: "",
  origin: "",
};

export default function UrlParser() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUrl>(emptyParsed);
  const [error, setError] = useState("");

  const handleParse = () => {
    try {
      const result = parseUrl(input);
      setParsed(result);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setParsed(emptyParsed);
    }
  };

  const handleBuild = () => {
    const url = buildUrl(parsed);
    setInput(url);
    setError("");
  };

  const updateField = (field: keyof ParsedUrl, value: string) => {
    setParsed((prev) => ({ ...prev, [field]: value }));
  };

  const updateParam = (index: number, field: "key" | "value", val: string) => {
    setParsed((prev) => {
      const params = [...prev.queryParams];
      params[index] = { ...params[index], [field]: val };
      return { ...prev, queryParams: params };
    });
  };

  const addParam = () => {
    setParsed((prev) => ({
      ...prev,
      queryParams: [...prev.queryParams, { key: "", value: "" }],
    }));
  };

  const removeParam = (index: number) => {
    setParsed((prev) => ({
      ...prev,
      queryParams: prev.queryParams.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          URL
        </label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="https://example.com:8080/path?key=value#section"
          />
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Parse
          </button>
          <button
            onClick={handleBuild}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Build
          </button>
          <CopyButton text={input} />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(["protocol", "host", "port", "pathname", "hash"] as const).map(
          (field) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {field}
              </label>
              <input
                value={parsed[field]}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full p-2 font-mono text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          )
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Query Parameters
          </label>
          <button
            onClick={addParam}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {parsed.queryParams.map((param, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={param.key}
                onChange={(e) => updateParam(i, "key", e.target.value)}
                placeholder="key"
                className="flex-1 p-2 font-mono text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
              <span className="text-gray-400">=</span>
              <input
                value={param.value}
                onChange={(e) => updateParam(i, "value", e.target.value)}
                placeholder="value"
                className="flex-1 p-2 font-mono text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              />
              <button
                onClick={() => removeParam(i)}
                className="text-red-500 hover:text-red-700 px-2"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
