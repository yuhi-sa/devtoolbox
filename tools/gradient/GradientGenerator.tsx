"use client";

import { useState } from "react";
import { generateGradientCSS, generateFullCSS, directionPresets, GradientType } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function GradientGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);
  const [color1, setColor1] = useState("#667eea");
  const [color2, setColor2] = useState("#764ba2");
  const [color3, setColor3] = useState("");
  const [useThirdColor, setUseThirdColor] = useState(false);

  const options = { type, angle, color1, color2, color3: useThirdColor ? color3 : undefined };
  const gradientCSS = generateGradientCSS(options);
  const fullCSS = generateFullCSS(options);

  return (
    <div className="space-y-4">
      <div
        className="w-full h-40 rounded-lg border dark:border-gray-600"
        style={{ background: gradientCSS }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as GradientType)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {type === "linear" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Angle: {angle}deg
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-1 mt-1 flex-wrap">
                {directionPresets.map((preset) => (
                  <button
                    key={preset.angle}
                    onClick={() => setAngle(preset.angle)}
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Color 1
              </label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Color 2
              </label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            {useThirdColor && (
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Color 3
                </label>
                <input
                  type="color"
                  value={color3 || "#00d2ff"}
                  onChange={(e) => setColor3(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useThirdColor}
              onChange={(e) => {
                setUseThirdColor(e.target.checked);
                if (e.target.checked && !color3) setColor3("#00d2ff");
              }}
            />
            Add third color
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS</label>
          <CopyButton text={fullCSS} />
        </div>
        <textarea
          readOnly
          value={fullCSS}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
