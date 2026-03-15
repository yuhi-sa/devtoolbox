"use client";

import { useState } from "react";
import { generateFaviconSvg, generateLinkTags } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function FaviconGenerator() {
  const [character, setCharacter] = useState("F");
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");

  const svgCode = generateFaviconSvg({ character, backgroundColor, textColor });
  const linkTags = generateLinkTags("favicon.svg");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Emoji or Character
          </label>
          <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value.slice(0, 2))}
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-2xl"
            maxLength={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border dark:border-gray-600"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 border rounded px-3 py-2 font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border dark:border-gray-600"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 border rounded px-3 py-2 font-mono text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preview:
        </label>
        <div
          className="border rounded dark:border-gray-600 p-2"
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SVG Code
          </label>
          <CopyButton text={svgCode} />
        </div>
        <textarea
          readOnly
          value={svgCode}
          className="w-full h-32 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            HTML Link Tags
          </label>
          <CopyButton text={linkTags} />
        </div>
        <textarea
          readOnly
          value={linkTags}
          className="w-full h-20 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
