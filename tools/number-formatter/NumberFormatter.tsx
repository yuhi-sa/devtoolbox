"use client";

import { useState } from "react";
import { formatNumber } from "./logic";
import type { FormatOptions } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function NumberFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [thousandSeparator, setThousandSeparator] = useState(",");
  const [decimalPlaces, setDecimalPlaces] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyPosition, setCurrencyPosition] = useState<"prefix" | "suffix">("prefix");
  const [notation, setNotation] = useState<"standard" | "scientific" | "compact">("standard");

  const handleFormat = () => {
    try {
      setError("");
      const options: FormatOptions = {
        thousandSeparator,
        notation,
        currencySymbol: currencySymbol || undefined,
        currencyPosition,
      };
      if (decimalPlaces !== "") {
        options.decimalPlaces = parseInt(decimalPlaces, 10);
      }
      setOutput(formatNumber(input, options));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Thousand Separator
          </label>
          <input
            type="text"
            value={thousandSeparator}
            onChange={(e) => setThousandSeparator(e.target.value)}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Decimal Places
          </label>
          <input
            type="number"
            min="0"
            max="20"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(e.target.value)}
            placeholder="Auto"
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Currency Symbol
          </label>
          <input
            type="text"
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            placeholder="e.g. $, €"
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Notation
          </label>
          <select
            value={notation}
            onChange={(e) => setNotation(e.target.value as "standard" | "scientific" | "compact")}
            className="w-full p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="standard">Standard</option>
            <option value="scientific">Scientific</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Format
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Input Number
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter a number..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted Output
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
