"use client";

import { useState, useMemo } from "react";
import { CronParts, buildCronExpression, describeCron, getNextExecutions } from "./logic";
import CopyButton from "@/components/CopyButton";

const FIELD_OPTIONS = {
  minute: { label: "Minute", min: 0, max: 59, placeholder: "0-59" },
  hour: { label: "Hour", min: 0, max: 23, placeholder: "0-23" },
  dayOfMonth: { label: "Day of Month", min: 1, max: 31, placeholder: "1-31" },
  month: { label: "Month", min: 1, max: 12, placeholder: "1-12" },
  dayOfWeek: { label: "Day of Week", min: 0, max: 6, placeholder: "0-6 (Sun-Sat)" },
} as const;

export default function CrontabGenerator() {
  const [parts, setParts] = useState<CronParts>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });

  const expression = useMemo(() => buildCronExpression(parts), [parts]);
  const description = useMemo(() => describeCron(parts), [parts]);
  const nextRuns = useMemo(() => {
    try {
      return getNextExecutions(parts, 5);
    } catch {
      return [];
    }
  }, [parts]);

  const updateField = (field: keyof CronParts, value: string) => {
    setParts((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.keys(FIELD_OPTIONS) as Array<keyof typeof FIELD_OPTIONS>).map(
          (field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {FIELD_OPTIONS[field].label}
              </label>
              <input
                type="text"
                value={parts[field]}
                onChange={(e) => updateField(field, e.target.value)}
                placeholder={FIELD_OPTIONS[field].placeholder}
                className="w-full px-3 py-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <code className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
          {expression}
        </code>
        <CopyButton text={expression} />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Description
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
          {description}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Next 5 Execution Times
        </h3>
        {nextRuns.length > 0 ? (
          <ul className="space-y-1">
            {nextRuns.map((date, i) => (
              <li
                key={i}
                className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded"
              >
                {date.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No executions found in the next year.
          </p>
        )}
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500">
        <p>
          Syntax: minute hour day-of-month month day-of-week
        </p>
        <p>
          Use * for any, */N for every N, N-M for range, N,M for list
        </p>
      </div>
    </div>
  );
}
