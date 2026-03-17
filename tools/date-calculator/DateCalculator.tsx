"use client";

import { useState } from "react";
import { calculateDateDifference, addDaysToDate, DateDifference } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function DateCalculator() {
  const today = new Date().toISOString().split("T")[0];

  const [date1, setDate1] = useState(today);
  const [date2, setDate2] = useState(today);
  const [diff, setDiff] = useState<DateDifference | null>(null);
  const [diffError, setDiffError] = useState("");

  const [baseDate, setBaseDate] = useState(today);
  const [daysToAdd, setDaysToAdd] = useState("0");
  const [resultDate, setResultDate] = useState("");
  const [addError, setAddError] = useState("");

  const handleCalculateDiff = () => {
    try {
      setDiffError("");
      setDiff(calculateDateDifference(date1, date2));
    } catch (e) {
      setDiffError((e as Error).message);
      setDiff(null);
    }
  };

  const handleAddDays = () => {
    try {
      setAddError("");
      setResultDate(addDaysToDate(baseDate, parseInt(daysToAdd, 10) || 0));
    } catch (e) {
      setAddError((e as Error).message);
      setResultDate("");
    }
  };

  const diffText = diff
    ? `${diff.years}y ${diff.months}m ${diff.days}d (${diff.totalDays} days, ${diff.totalWeeks} weeks)`
    : "";

  return (
    <div className="space-y-6">
      {/* Date Difference */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Date Difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCalculateDiff}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Calculate Difference
        </button>

        {diffError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {diffError}
          </div>
        )}

        {diff && (
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {diff.years > 0 && `${diff.years} year${diff.years !== 1 ? "s" : ""} `}
                  {diff.months > 0 && `${diff.months} month${diff.months !== 1 ? "s" : ""} `}
                  {diff.days} day{diff.days !== 1 ? "s" : ""}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {diff.totalDays} total days / {diff.totalWeeks} weeks
                </div>
              </div>
              <CopyButton text={diffText} />
            </div>
          </div>
        )}
      </div>

      <hr className="dark:border-gray-600" />

      {/* Add/Subtract Days */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Add/Subtract Days
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Base Date
            </label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Days (negative to subtract)
            </label>
            <input
              type="number"
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleAddDays}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Calculate
        </button>

        {addError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {addError}
          </div>
        )}

        {resultDate && (
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {resultDate}
              </div>
              <CopyButton text={resultDate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
