"use client";

import { useState } from "react";
import {
  parseSemver,
  compareVersions,
  satisfiesRange,
  isValidSemver,
  SemverParsed,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function SemverTester() {
  const [version, setVersion] = useState("");
  const [parsed, setParsed] = useState<SemverParsed | null>(null);
  const [parseError, setParseError] = useState("");

  const [versionA, setVersionA] = useState("");
  const [versionB, setVersionB] = useState("");
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [compareError, setCompareError] = useState("");

  const [rangeVersion, setRangeVersion] = useState("");
  const [range, setRange] = useState("");
  const [rangeResult, setRangeResult] = useState<boolean | null>(null);
  const [rangeError, setRangeError] = useState("");

  const handleParse = () => {
    try {
      setParseError("");
      setParsed(parseSemver(version));
    } catch (e) {
      setParseError((e as Error).message);
      setParsed(null);
    }
  };

  const handleCompare = () => {
    try {
      setCompareError("");
      const cmp = compareVersions(versionA, versionB);
      if (cmp > 0) setCompareResult(`${versionA} > ${versionB}`);
      else if (cmp < 0) setCompareResult(`${versionA} < ${versionB}`);
      else setCompareResult(`${versionA} = ${versionB}`);
    } catch (e) {
      setCompareError((e as Error).message);
      setCompareResult(null);
    }
  };

  const handleRangeCheck = () => {
    try {
      setRangeError("");
      setRangeResult(satisfiesRange(rangeVersion, range));
    } catch (e) {
      setRangeError((e as Error).message);
      setRangeResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Parse Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Parse Version
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="flex-1 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            placeholder="1.2.3-alpha.1+build.123"
          />
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Parse
          </button>
        </div>

        {parseError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {parseError}
          </div>
        )}

        {parsed && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "Major", value: parsed.major },
              { label: "Minor", value: parsed.minor },
              { label: "Patch", value: parsed.patch },
              { label: "Prerelease", value: parsed.prerelease || "-" },
              { label: "Build", value: parsed.build || "-" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {label}
                </div>
                <div className="text-xl font-bold font-mono text-gray-900 dark:text-gray-100">
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="dark:border-gray-600" />

      {/* Compare Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Compare Versions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            placeholder="1.0.0"
          />
          <input
            type="text"
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            placeholder="2.0.0"
          />
        </div>
        <button
          onClick={handleCompare}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Compare
        </button>

        {compareError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {compareError}
          </div>
        )}

        {compareResult && (
          <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 flex justify-between items-center">
            <span className="text-xl font-bold font-mono text-gray-900 dark:text-gray-100">
              {compareResult}
            </span>
            <CopyButton text={compareResult} />
          </div>
        )}
      </div>

      <hr className="dark:border-gray-600" />

      {/* Range Check Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Range Check
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Version
            </label>
            <input
              type="text"
              value={rangeVersion}
              onChange={(e) => setRangeVersion(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              placeholder="1.5.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Range
            </label>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              placeholder="^1.0.0, ~1.2.0, >=1.0.0"
            />
          </div>
        </div>
        <button
          onClick={handleRangeCheck}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Check
        </button>

        {rangeError && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {rangeError}
          </div>
        )}

        {rangeResult !== null && (
          <div
            className={`p-4 rounded-lg border ${
              rangeResult
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
          >
            <span
              className={`font-bold text-lg ${
                rangeResult
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {rangeResult
                ? `${rangeVersion} satisfies ${range}`
                : `${rangeVersion} does NOT satisfy ${range}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
