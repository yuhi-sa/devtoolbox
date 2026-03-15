"use client";

import { useState } from "react";
import { generatePalette } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const palette = generatePalette(baseColor);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Base Color:
        </label>
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border dark:border-gray-600"
        />
        <input
          type="text"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="px-3 py-2 border rounded font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none w-28"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {palette.map((color, i) => (
          <div
            key={i}
            className="border rounded-lg overflow-hidden dark:border-gray-600"
          >
            <div
              className="h-20 w-full"
              style={{ backgroundColor: color.hex }}
            />
            <div className="p-2 space-y-1">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {color.label}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {color.hex}
                </span>
                <CopyButton text={color.hex} />
              </div>
              <div className="text-xs font-mono text-gray-500 dark:text-gray-500">
                rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
