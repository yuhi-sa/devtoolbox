"use client";

import { useState } from "react";
import { convertBase, getBaseLabel, Base, ConversionResult } from "./logic";
import CopyButton from "@/components/CopyButton";

const BASES: Base[] = [2, 8, 10, 16];

export default function BaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState<Base>(10);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      setError("");
      setResult(convertBase(input, fromBase));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const resultText = result
    ? `Binary: ${result.binary}\nOctal: ${result.octal}\nDecimal: ${result.decimal}\nHex: ${result.hex}`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Value
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter value..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            From Base
          </label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value) as Base)}
            className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {BASES.map((b) => (
              <option key={b} value={b}>
                {getBaseLabel(b)}
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

      {result && (
        <div>
          <div className="flex justify-end mb-1">
            <CopyButton text={resultText} />
          </div>
          <table className="w-full text-sm font-mono border rounded-lg overflow-hidden">
            <tbody>
              {([
                ["Binary (2)", result.binary],
                ["Octal (8)", result.octal],
                ["Decimal (10)", result.decimal],
                ["Hexadecimal (16)", result.hex],
              ] as [string, string][]).map(([label, value]) => (
                <tr key={label} className="border-b dark:border-gray-600">
                  <td className="p-2 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    {label}
                  </td>
                  <td className="p-2 bg-white dark:bg-gray-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
