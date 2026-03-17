"use client";

import { useState } from "react";
import {
  punycodeEncode,
  punycodeDecode,
  domainToAce,
  domainFromAce,
} from "./logic";
import CopyButton from "@/components/CopyButton";

type Mode = "string" | "domain";

export default function PunycodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("domain");

  const handleEncode = () => {
    try {
      setError("");
      if (mode === "domain") {
        setOutput(domainToAce(input));
      } else {
        setOutput(punycodeEncode(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setError("");
      if (mode === "domain") {
        setOutput(domainFromAce(input));
      } else {
        setOutput(punycodeDecode(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mode:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="domain">Domain (IDN)</option>
            <option value="string">Raw Punycode</option>
          </select>
        </label>

        <button
          onClick={handleEncode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Encode
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Decode
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
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter domain or text..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
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
