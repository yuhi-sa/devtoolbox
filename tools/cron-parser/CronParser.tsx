"use client";

import { useState } from "react";
import { describeCron, getNextExecutions, CRON_PRESETS } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function CronParser() {
  const [expression, setExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");
  const [nextTimes, setNextTimes] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleParse = () => {
    try {
      setError("");
      const desc = describeCron(expression);
      setDescription(desc);
      const times = getNextExecutions(expression, new Date(), 5);
      setNextTimes(times.map((t) => t.toLocaleString()));
    } catch (e) {
      setError((e as Error).message);
      setDescription("");
      setNextTimes([]);
    }
  };

  const handlePreset = (expr: string) => {
    setExpression(expr);
    try {
      setError("");
      const desc = describeCron(expr);
      setDescription(desc);
      const times = getNextExecutions(expr, new Date(), 5);
      setNextTimes(times.map((t) => t.toLocaleString()));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Cron式（5フィールド: 分 時 日 月 曜日）
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            className="flex-1 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="* * * * *"
          />
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            解析
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CRON_PRESETS.map((preset) => (
          <button
            key={preset.expression}
            onClick={() => handlePreset(preset.expression)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {description && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                説明
              </label>
              <CopyButton text={description} />
            </div>
            <div className="p-3 font-mono text-sm bg-gray-50 dark:bg-gray-900 border dark:border-gray-600 rounded-lg">
              {description}
            </div>
          </div>

          {nextTimes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                次の5回の実行予定
              </label>
              <ul className="space-y-1">
                {nextTimes.map((time, i) => (
                  <li
                    key={i}
                    className="p-2 font-mono text-sm bg-gray-50 dark:bg-gray-900 border dark:border-gray-600 rounded"
                  >
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
