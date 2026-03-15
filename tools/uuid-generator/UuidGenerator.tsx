"use client";

import { useState } from "react";
import { generateUuid, generateBulkUuids, validateUuid } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function UuidGenerator() {
  const [uuid, setUuid] = useState("");
  const [bulkCount, setBulkCount] = useState("5");
  const [bulkResult, setBulkResult] = useState("");
  const [validateInput, setValidateInput] = useState("");
  const [validResult, setValidResult] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = () => {
    setUuid(generateUuid());
  };

  const handleBulk = () => {
    try {
      setError("");
      const count = parseInt(bulkCount, 10);
      if (isNaN(count)) throw new Error("数値を入力してください。");
      const uuids = generateBulkUuids(count);
      setBulkResult(uuids.join("\n"));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleValidate = () => {
    setValidResult(validateUuid(validateInput));
  };

  return (
    <div className="space-y-6">
      {/* Single UUID */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          UUID v4 生成
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            生成
          </button>
          {uuid && <CopyButton text={uuid} />}
        </div>
        {uuid && (
          <code className="block font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            {uuid}
          </code>
        )}
      </div>

      {/* Bulk UUIDs */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          一括生成
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={bulkCount}
            onChange={(e) => setBulkCount(e.target.value)}
            className="w-24 p-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="1"
            max="1000"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">件</span>
          <button
            onClick={handleBulk}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            一括生成
          </button>
          {bulkResult && <CopyButton text={bulkResult} />}
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {bulkResult && (
          <textarea
            readOnly
            value={bulkResult}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        )}
      </div>

      {/* Validate */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          UUIDバリデーション
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={validateInput}
            onChange={(e) => {
              setValidateInput(e.target.value);
              setValidResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
            className="flex-1 p-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="UUIDを入力して検証..."
          />
          <button
            onClick={handleValidate}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            検証
          </button>
        </div>
        {validResult !== null && (
          <div
            className={`text-sm p-2 rounded ${
              validResult
                ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                : "text-red-500 bg-red-50 dark:bg-red-900/20"
            }`}
          >
            {validResult ? "有効なUUID形式です。" : "無効なUUID形式です。"}
          </div>
        )}
      </div>
    </div>
  );
}
