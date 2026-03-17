"use client";

import { useState } from "react";
import {
  generateId,
  generateNanoid,
  generateUlidLike,
  generateSnowflakeLike,
  batchGenerate,
  getAlphabet,
  AlphabetType,
} from "./logic";
import CopyButton from "@/components/CopyButton";

type Format = "nanoid" | "ulid" | "snowflake";

export default function NanoidGenerator() {
  const [format, setFormat] = useState<Format>("nanoid");
  const [length, setLength] = useState("21");
  const [alphabetType, setAlphabetType] = useState<AlphabetType>("nanoid");
  const [customAlphabet, setCustomAlphabet] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [count, setCount] = useState("1");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = () => {
    try {
      setError("");
      const n = parseInt(count, 10);
      if (isNaN(n)) throw new Error("Count must be a number.");

      const alphabet = useCustom ? customAlphabet : getAlphabet(alphabetType);

      let generator: () => string;
      switch (format) {
        case "ulid":
          generator = generateUlidLike;
          break;
        case "snowflake":
          generator = generateSnowflakeLike;
          break;
        default: {
          const len = parseInt(length, 10);
          if (isNaN(len)) throw new Error("Length must be a number.");
          generator = () => generateId(len, alphabet);
        }
      }

      const ids = batchGenerate(n, generator);
      setOutput(ids.join("\n"));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Format:
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="nanoid">NanoID</option>
            <option value="ulid">ULID-like</option>
            <option value="snowflake">Snowflake-like</option>
          </select>
        </label>

        {format === "nanoid" && (
          <>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Length:
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="ml-2 w-20 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
                max="256"
              />
            </label>

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Alphabet:
              <select
                value={useCustom ? "custom" : alphabetType}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setUseCustom(true);
                  } else {
                    setUseCustom(false);
                    setAlphabetType(e.target.value as AlphabetType);
                  }
                }}
                className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="nanoid">Default (A-Za-z0-9_-)</option>
                <option value="alphanumeric">Alphanumeric</option>
                <option value="hex">Hex</option>
                <option value="numeric">Numeric</option>
                <option value="lowercase">Lowercase + digits</option>
                <option value="custom">Custom</option>
              </select>
            </label>
          </>
        )}

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Count:
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="ml-2 w-20 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="1"
            max="1000"
          />
        </label>
      </div>

      {useCustom && format === "nanoid" && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Custom Alphabet
          </label>
          <input
            type="text"
            value={customAlphabet}
            onChange={(e) => setCustomAlphabet(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter custom characters..."
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
        {output && <CopyButton text={output} />}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {output && (
        <textarea
          readOnly
          value={output}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      )}
    </div>
  );
}
