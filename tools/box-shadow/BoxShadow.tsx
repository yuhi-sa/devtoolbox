"use client";

import { useState } from "react";
import { BoxShadowOptions, defaultBoxShadow, generateFullCSS, generateBoxShadowCSS } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function BoxShadow() {
  const [options, setOptions] = useState<BoxShadowOptions>(defaultBoxShadow);

  const update = (key: keyof BoxShadowOptions, value: number | string | boolean) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const css = generateFullCSS(options);
  const shadowValue = generateBoxShadowCSS(options);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              X Offset: {options.x}px
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={options.x}
              onChange={(e) => update("x", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Y Offset: {options.y}px
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={options.y}
              onChange={(e) => update("y", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Blur: {options.blur}px
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={options.blur}
              onChange={(e) => update("blur", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Spread: {options.spread}px
            </label>
            <input
              type="range"
              min={-50}
              max={50}
              value={options.spread}
              onChange={(e) => update("spread", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Opacity: {options.opacity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={options.opacity}
              onChange={(e) => update("opacity", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              Color:
              <input
                type="color"
                value={options.color}
                onChange={(e) => update("color", e.target.value)}
                className="w-8 h-8 rounded border dark:border-gray-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={options.inset}
                onChange={(e) => update("inset", e.target.checked)}
              />
              Inset
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="border rounded-lg p-8 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 flex items-center justify-center min-h-[200px]">
            <div
              className="w-32 h-32 bg-white dark:bg-gray-700 rounded-lg"
              style={{ boxShadow: shadowValue }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated CSS
          </label>
          <CopyButton text={css} />
        </div>
        <input
          type="text"
          readOnly
          value={css}
          className="w-full p-2 font-mono text-sm border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
