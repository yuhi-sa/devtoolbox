"use client";

import { useState } from "react";
import { calculateContrastRatio, isValidHexColor, ContrastResult } from "./logic";
import CopyButton from "@/components/CopyButton";

function PassBadge({ pass }: { pass: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-bold rounded ${
        pass
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {pass ? "PASS" : "FAIL"}
    </span>
  );
}

export default function ColorContrast() {
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [result, setResult] = useState<ContrastResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = () => {
    try {
      setError("");
      setResult(calculateContrastRatio(foreground, background));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const fgValid = isValidHexColor(foreground);
  const bgValid = isValidHexColor(background);

  const summaryText = result
    ? `Contrast Ratio: ${result.ratioString}\nAA Normal: ${result.aa.normalText ? "Pass" : "Fail"}\nAA Large: ${result.aa.largeText ? "Pass" : "Fail"}\nAAA Normal: ${result.aaa.normalText ? "Pass" : "Fail"}\nAAA Large: ${result.aaa.largeText ? "Pass" : "Fail"}`
    : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Foreground Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={fgValid ? (foreground.startsWith("#") ? foreground : `#${foreground}`) : "#000000"}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-10 rounded border dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              placeholder="#000000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgValid ? (background.startsWith("#") ? background : `#${background}`) : "#ffffff"}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-10 rounded border dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCheck}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Check Contrast
      </button>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="p-6 rounded-lg border dark:border-gray-600 text-center"
            style={{
              backgroundColor: background.startsWith("#") ? background : `#${background}`,
              color: foreground.startsWith("#") ? foreground : `#${foreground}`,
            }}
          >
            <p className="text-2xl font-bold">Sample Text</p>
            <p className="text-sm mt-1">The quick brown fox jumps over the lazy dog</p>
          </div>

          {/* Ratio */}
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Contrast Ratio
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {result.ratioString}
              </div>
            </div>
            <CopyButton text={result.ratioString} />
          </div>

          {/* WCAG Results */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                AA Normal Text (4.5:1)
              </div>
              <PassBadge pass={result.aa.normalText} />
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                AA Large Text (3:1)
              </div>
              <PassBadge pass={result.aa.largeText} />
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                AAA Normal Text (7:1)
              </div>
              <PassBadge pass={result.aaa.normalText} />
            </div>
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                AAA Large Text (4.5:1)
              </div>
              <PassBadge pass={result.aaa.largeText} />
            </div>
          </div>

          <div className="flex justify-end">
            <CopyButton text={summaryText} label="Copy Report" />
          </div>
        </div>
      )}
    </div>
  );
}
