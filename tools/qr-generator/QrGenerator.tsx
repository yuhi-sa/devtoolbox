"use client";

import { useState } from "react";
import { validateQrInput, generateQrUrl } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = () => {
    const validationError = validateQrInput(text);
    if (validationError) {
      setError(validationError);
      setQrUrl("");
      return;
    }
    setError("");
    setQrUrl(generateQrUrl({ text, size }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter text or URL..."
        />
      </div>

      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Size (px)
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value={100}>100x100</option>
            <option value={200}>200x200</option>
            <option value={300}>300x300</option>
            <option value={400}>400x400</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
        {qrUrl && <CopyButton text={qrUrl} label="Copy URL" />}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {qrUrl && (
        <div className="flex justify-center p-4 bg-white rounded-lg border dark:border-gray-600">
          <img src={qrUrl} alt="QR Code" width={size} height={size} />
        </div>
      )}
    </div>
  );
}
