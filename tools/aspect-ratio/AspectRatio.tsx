"use client";

import { useState } from "react";
import {
  calculateAspectRatio,
  resizeByWidth,
  resizeByHeight,
  COMMON_RATIOS,
  AspectRatioResult,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function AspectRatio() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [result, setResult] = useState<AspectRatioResult | null>(null);
  const [error, setError] = useState("");

  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");
  const [resized, setResized] = useState<{ width: number; height: number } | null>(null);

  const handleCalculate = () => {
    try {
      setError("");
      const r = calculateAspectRatio(
        parseFloat(width) || 0,
        parseFloat(height) || 0
      );
      setResult(r);
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const handleResizeByWidth = () => {
    if (!result) return;
    try {
      setResized(
        resizeByWidth(result.width, result.height, parseInt(targetWidth, 10) || 0)
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleResizeByHeight = () => {
    if (!result) return;
    try {
      setResized(
        resizeByHeight(result.width, result.height, parseInt(targetHeight, 10) || 0)
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleCommonRatio = (w: number, h: number) => {
    setWidth(String(w));
    setHeight(String(h));
    try {
      setError("");
      setResult(calculateAspectRatio(w, h));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Width
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Height
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Calculate
      </button>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {result.ratio}
              </span>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                ({result.decimal.toFixed(4)})
              </span>
            </div>
            <CopyButton text={result.ratio} />
          </div>
        </div>
      )}

      {/* Resize Calculator */}
      {result && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resize with same ratio ({result.ratio})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Target Width
                </label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => setTargetWidth(e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 1280"
                />
              </div>
              <button
                onClick={handleResizeByWidth}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Go
              </button>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Target Height
                </label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => setTargetHeight(e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. 720"
                />
              </div>
              <button
                onClick={handleResizeByHeight}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Go
              </button>
            </div>
          </div>
          {resized && (
            <div className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 flex justify-between items-center">
              <span className="font-mono text-gray-900 dark:text-gray-100">
                {resized.width} x {resized.height}
              </span>
              <CopyButton text={`${resized.width}x${resized.height}`} />
            </div>
          )}
        </div>
      )}

      {/* Common Ratios */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Common Ratios
        </h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_RATIOS.map((r) => (
            <button
              key={r.name}
              onClick={() => handleCommonRatio(r.width, r.height)}
              className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition text-gray-700 dark:text-gray-300"
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
