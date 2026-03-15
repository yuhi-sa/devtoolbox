"use client";

import { useState, useCallback } from "react";
import {
  generatePassword,
  calculateStrength,
  PasswordOptions,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<{ score: number; label: string }>({
    score: 0,
    label: "",
  });

  const generate = useCallback(() => {
    const pw = generatePassword(options);
    setPassword(pw);
    setStrength(calculateStrength(pw));
  }, [options]);

  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 md:col-span-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Length: {options.length}
          </label>
          <input
            type="range"
            min={4}
            max={64}
            value={options.length}
            onChange={(e) =>
              setOptions({ ...options, length: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        {(
          [
            ["uppercase", "A-Z"],
            ["lowercase", "a-z"],
            ["numbers", "0-9"],
            ["symbols", "!@#"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={(e) =>
                setOptions({ ...options, [key]: e.target.checked })
              }
              className="rounded"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        onClick={generate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Generate Password
      </button>

      {password && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={password}
              className="flex-1 p-3 font-mono text-lg border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
            />
            <CopyButton text={password} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div
                className={`h-full transition-all ${strengthColors[strength.score]}`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {strength.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
