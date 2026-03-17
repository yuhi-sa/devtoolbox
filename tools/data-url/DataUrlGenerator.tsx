"use client";

import { useState } from "react";
import { textToDataUrl, getDataUrlSize, MIME_TYPES, MimeType, isValidSvg } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function DataUrlGenerator() {
  const [input, setInput] = useState("");
  const [mimeType, setMimeType] = useState<MimeType>("text/plain");
  const [useBase64, setUseBase64] = useState(true);

  const dataUrl = textToDataUrl(input, mimeType, useBase64);
  const size = getDataUrlSize(dataUrl);
  const isSvg = mimeType === "image/svg+xml" && isValidSvg(input);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          MIME Type:
          <select
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value as MimeType)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {MIME_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={useBase64}
            onChange={(e) => setUseBase64(e.target.checked)}
          />
          Base64 encoding
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter text or SVG content..."
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Data URL
          </label>
          <div className="flex items-center gap-2">
            {dataUrl && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Size: {size.formatted}
              </span>
            )}
            <CopyButton text={dataUrl} />
          </div>
        </div>
        <textarea
          readOnly
          value={dataUrl}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>

      {isSvg && dataUrl && (
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            SVG Preview
          </label>
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-600 flex items-center justify-center">
            <img src={dataUrl} alt="SVG Preview" className="max-w-full max-h-48" />
          </div>
        </div>
      )}
    </div>
  );
}
