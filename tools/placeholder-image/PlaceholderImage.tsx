"use client";

import { useState } from "react";
import { generatePlaceholderSvg, generateDataUrl } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function PlaceholderImage() {
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const [bgColor, setBgColor] = useState("#CCCCCC");
  const [textColor, setTextColor] = useState("#666666");
  const [text, setText] = useState("");

  const svg = generatePlaceholderSvg({
    width,
    height,
    bgColor,
    textColor,
    text: text || undefined,
  });
  const dataUrl = generateDataUrl(svg);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end flex-wrap">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Width
          <input
            type="number"
            min={1}
            max={4000}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="block w-24 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 mt-1"
          />
        </label>
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Height
          <input
            type="number"
            min={1}
            max={4000}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="block w-24 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 mt-1"
          />
        </label>
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Background
          <div className="flex gap-1 mt-1">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-24 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 font-mono text-sm"
            />
          </div>
        </label>
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Text Color
          <div className="flex gap-1 mt-1">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-24 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 font-mono text-sm"
            />
          </div>
        </label>
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Text (optional)
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-48 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 mt-1"
            placeholder={`${width} x ${height}`}
          />
        </label>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Preview
        </h3>
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-600 overflow-auto">
          <img
            src={dataUrl}
            alt={`Placeholder ${width}x${height}`}
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SVG Code
          </label>
          <CopyButton text={svg} />
        </div>
        <textarea
          readOnly
          value={svg}
          className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data URL
          </label>
          <CopyButton text={dataUrl} />
        </div>
        <textarea
          readOnly
          value={dataUrl}
          className="w-full h-20 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 break-all"
        />
      </div>
    </div>
  );
}
