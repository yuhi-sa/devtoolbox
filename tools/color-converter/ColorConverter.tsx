"use client";

import { useState } from "react";
import { parseColorInput } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function ColorConverter() {
  const [input, setInput] = useState("");
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      setError("");
      const result = parseColorInput(input);
      setHex(result.hex);
      setRgb(`rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`);
      setHsl(`hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`);
    } catch (e) {
      setError((e as Error).message);
      setHex("");
      setRgb("");
      setHsl("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          カラー入力（HEX / RGB / HSL）
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            className="flex-1 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="#ff6600, rgb(255,102,0), hsl(24,100%,50%)"
          />
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            変換
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {hex && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-lg border dark:border-gray-600"
              style={{ backgroundColor: hex }}
            />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                  HEX:
                </span>
                <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                  {hex}
                </code>
                <CopyButton text={hex} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                  RGB:
                </span>
                <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                  {rgb}
                </code>
                <CopyButton text={rgb} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                  HSL:
                </span>
                <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                  {hsl}
                </code>
                <CopyButton text={hsl} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
