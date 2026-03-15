"use client";

import { useState } from "react";
import { convertBytes, UNITS, ByteUnit, ConversionResult } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function ByteConverter() {
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<ByteUnit>("GB");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      setError("");
      setResults(convertBytes(parseFloat(value), unit));
    } catch (e) {
      setError((e as Error).message);
      setResults([]);
    }
  };

  const resultText = results
    .map((r) => `${r.unit}: ${r.binary} (binary) / ${r.si} (SI)`)
    .join("\n");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-40 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as ByteUnit)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Convert
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex justify-end mb-1">
            <CopyButton text={resultText} />
          </div>
          <table className="w-full text-sm font-mono border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-2 text-left text-gray-700 dark:text-gray-300">Unit</th>
                <th className="p-2 text-right text-gray-700 dark:text-gray-300">Binary (1024)</th>
                <th className="p-2 text-right text-gray-700 dark:text-gray-300">SI (1000)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.unit} className="border-t dark:border-gray-600">
                  <td className="p-2 font-medium text-gray-700 dark:text-gray-300">{r.unit}</td>
                  <td className="p-2 text-right">{r.binary}</td>
                  <td className="p-2 text-right">{r.si}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
