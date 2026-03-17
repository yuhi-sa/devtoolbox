"use client";

import { useState } from "react";
import {
  BorderRadiusOptions,
  defaultBorderRadius,
  generateBorderRadiusCSS,
  getBorderRadiusValue,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function BorderRadius() {
  const [options, setOptions] = useState<BorderRadiusOptions>(defaultBorderRadius);

  const updateCorner = (key: keyof BorderRadiusOptions, value: number) => {
    if (options.linked) {
      setOptions((prev) => ({
        ...prev,
        topLeft: value,
        topRight: value,
        bottomRight: value,
        bottomLeft: value,
      }));
    } else {
      setOptions((prev) => ({ ...prev, [key]: value }));
    }
  };

  const css = generateBorderRadiusCSS(options);
  const borderRadiusValue = getBorderRadiusValue(options);

  const corners: { key: keyof BorderRadiusOptions; label: string }[] = [
    { key: "topLeft", label: "Top Left" },
    { key: "topRight", label: "Top Right" },
    { key: "bottomRight", label: "Bottom Right" },
    { key: "bottomLeft", label: "Bottom Left" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={options.linked}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, linked: e.target.checked }))
                }
              />
              Link all corners
            </label>

            <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              Unit:
              <select
                value={options.unit}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    unit: e.target.value as "px" | "%" | "rem",
                  }))
                }
                className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="rem">rem</option>
              </select>
            </label>
          </div>

          {corners.map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}: {options[key] as number}
                {options.unit}
              </label>
              <input
                type="range"
                min={0}
                max={options.unit === "%" ? 50 : 100}
                value={options[key] as number}
                onChange={(e) => updateCorner(key, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="border rounded-lg p-8 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 flex items-center justify-center min-h-[200px]">
            <div
              className="w-40 h-40 bg-blue-500"
              style={{ borderRadius: borderRadiusValue }}
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
