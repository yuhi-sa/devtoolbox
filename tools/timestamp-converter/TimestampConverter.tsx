"use client";

import { useState } from "react";
import {
  timestampToIso,
  isoToTimestamp,
  getCurrentTimestamp,
  timestampToLocalString,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [datetime, setDatetime] = useState("");
  const [error, setError] = useState("");

  const handleTimestampToDatetime = () => {
    try {
      setError("");
      const ts = parseInt(timestamp, 10);
      if (isNaN(ts)) throw new Error("数値を入力してください。");
      const iso = timestampToIso(ts);
      const local = timestampToLocalString(ts);
      setDatetime(`${iso}\n${local}`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDatetimeToTimestamp = () => {
    try {
      setError("");
      const ts = isoToTimestamp(datetime.split("\n")[0]);
      setTimestamp(ts.toString());
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleNow = () => {
    const now = getCurrentTimestamp();
    setTimestamp(now.toString());
    try {
      setError("");
      const iso = timestampToIso(now);
      const local = timestampToLocalString(now);
      setDatetime(`${iso}\n${local}`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleNow}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Now
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unix Timestamp（秒）
            </label>
            <CopyButton text={timestamp} />
          </div>
          <textarea
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="例: 1700000000"
          />
          <button
            onClick={handleTimestampToDatetime}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Timestamp → 日時
          </button>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              日時（ISO 8601）
            </label>
            <CopyButton text={datetime.split("\n")[0]} />
          </div>
          <textarea
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="例: 2023-11-14T22:13:20.000Z"
          />
          <button
            onClick={handleDatetimeToTimestamp}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            日時 → Timestamp
          </button>
        </div>
      </div>
    </div>
  );
}
